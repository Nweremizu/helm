"use client";

import { useUploadModal } from "@/components/profile-edit-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateProfileAction } from "@/lib/actions/user";
import { toast } from "sonner";
import { User } from "@/app/generated/prisma/client";

interface EditProfileFormProps {
  user: User;
}

const initialState = {
  error: "",
  success: "",
};

export function EditProfileForm({ user }: EditProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const { UploadModal, setShowUploadModal } = useUploadModal();

  // @ts-expect-error ignoreing type issue for now
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadModal(true);
      // Reset input value so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsUploadingAvatar(true);
    try {
      const file = new File([croppedBlob], "avatar", {
        type: croppedBlob.type || "image/jpeg",
      });

      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: form,
      });

      const payload = (await response.json()) as
        | { avatarUrl: string }
        | { error: string };

      if (!response.ok) {
        if ("error" in payload && payload.error) {
          throw new Error(payload.error);
        }
        throw new Error("Failed to upload avatar");
      }

      if (!("avatarUrl" in payload) || !payload.avatarUrl) {
        throw new Error("Invalid upload response");
      }

      setPreviewUrl(payload.avatarUrl);
      setSelectedFile(null);
      toast.success("Profile picture updated");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsDeletingAvatar(true);
    try {
      const response = await fetch("/api/user/avatar", { method: "DELETE" });
      const payload = (await response.json()) as
        | { success: true }
        | { error: string };

      if (!response.ok) {
        if ("error" in payload && payload.error) {
          throw new Error(payload.error);
        }
        throw new Error("Failed to remove avatar");
      }

      setPreviewUrl(null);
      toast.success("Profile picture removed");
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-background h-screen overflow-hidden">
      <UploadModal
        imageFile={selectedFile}
        onCropComplete={handleCropComplete}
      />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 flex flex-col gap-6">
        <Link
          href="/profile"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm mb-4"
        >
          <ArrowLeft size={16} />
          Back to Profile
        </Link>
        <section
          id="profile"
          className="py-8 relative font-mono  bg-white rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center sm:items-start gap-6"
        >
          <div className="grow text-center sm:text-left">
            <h1 className="font-sans text-2xl font-semibold text-primary dark:text-white mb-1">
              Edit Profile
            </h1>
            <p className="text-gray-500 text-xs dark:text-text-dark-secondary mb-4">
              Update your personal information.
            </p>
          </div>
          {/* Profile Pic area */}
          <div className="flex gap-6 items-center pb-10! border-b border-gray-200 dark:border-gray-800 w-full">
            <Avatar className="w-24 h-24">
              <AvatarImage src={previewUrl || ""} />
              <AvatarFallback className="text-3xl">
                {user.name?.slice(0, 2).toUpperCase() || "JD"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h2 className="font-sans font-medium text-base text-gray-700 dark:text-gray-300">
                Profile Picture
              </h2>
              <p className="text-xs text-gray-400">
                Supports JPG, PNG or WEBP. Max size of 4MB.
              </p>
              <div className="flex gap-2 mt-1 text-xs!">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload profile picture"
                />
                <Button
                  size="sm"
                  variant={"outline"}
                  onClick={handleUploadClick}
                  disabled={isUploadingAvatar || isDeletingAvatar}
                >
                  {" "}
                  Upload New
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs! text-red-500 hover:bg-red-100 hover:text-red-600"
                  onClick={handleRemoveAvatar}
                  disabled={isUploadingAvatar || isDeletingAvatar}
                >
                  {" "}
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Form area */}
          <form action={formAction} className="flex flex-col gap-6 mt-6 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                defaultValue={user.name || ""}
                placeholder="Alex Morgan"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                defaultValue={user.email}
                placeholder="alex@example.com"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <Link href="/profile">
                <Button variant={"outline"} size={"sm"}>
                  Cancel
                </Button>
              </Link>
              <Button
                size={"sm"}
                variant={"default"}
                disabled={isPending || isUploadingAvatar || isDeletingAvatar}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
