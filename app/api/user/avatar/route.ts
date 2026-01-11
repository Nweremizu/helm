import { cookies } from "next/headers";
import { prisma } from "@/prisma/db";
import { validateSessionToken } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { getCloudinary } from "@/lib/cloudinary";

const MAX_AVATAR_BYTES = 4 * 1024 * 1024;

function getFixedAvatarPublicId(userId: string) {
  return `users/${userId}/avatar`;
}

function isAllowedImageType(type: string) {
  return type === "image/jpeg" || type === "image/png" || type === "image/webp";
}

export async function POST(request: Request) {
  const token = (await cookies()).get("session")?.value ?? null;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }

  if (!isAllowedImageType(file.type)) {
    return Response.json({ error: "Unsupported file type" }, { status: 400 });
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return Response.json(
      { error: "File too large (max 4MB)" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { id: user.id },
    select: { avatarPublicId: true },
  });

  const oldPublicId = existing?.avatarPublicId ?? null;
  const newPublicId = getFixedAvatarPublicId(user.id);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const cloudinary = getCloudinary();

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      public_id: newPublicId,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: uploadResult.secure_url,
        avatarPublicId: newPublicId,
      },
    });

    if (oldPublicId && oldPublicId !== newPublicId) {
      cloudinary.uploader
        .destroy(oldPublicId, { resource_type: "image", invalidate: true })
        .catch((error) => {
          console.error("Failed to delete previous avatar:", error);
        });
    }

    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return Response.json({
      avatarUrl: uploadResult.secure_url,
      avatarPublicId: newPublicId,
    });
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    return Response.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}

export async function DELETE() {
  const token = (await cookies()).get("session")?.value ?? null;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: user.id },
    select: { avatarPublicId: true },
  });

  const publicIdToDelete =
    existing?.avatarPublicId ?? getFixedAvatarPublicId(user.id);

  try {
    const cloudinary = getCloudinary();

    await cloudinary.uploader.destroy(publicIdToDelete, {
      resource_type: "image",
      invalidate: true,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: null, avatarPublicId: null },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete avatar:", error);
    return Response.json({ error: "Failed to delete avatar" }, { status: 500 });
  }
}
