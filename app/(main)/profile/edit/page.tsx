import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { validateSessionToken } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
  const token = (await cookies()).get("session")?.value ?? null;
  if (!token) {
    redirect("/login");
  }

  const { user } = await validateSessionToken(token);
  if (!user) {
    redirect("/login");
  }

  return <EditProfileForm user={user} />;
}
