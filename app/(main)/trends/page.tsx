import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/dal";
import TrendsClient from "./trends-client";

export default async function TrendsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <TrendsClient />;
}
