import "server-only";
import { User } from "@/app/generated/prisma/client";

export type AuthDTO = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  is_verified: boolean;
};

export function toAuthDTO(user: User): AuthDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    is_verified: user.isVerified,
  };
}
