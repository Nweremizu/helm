import { NextResponse } from "next/server";
import { getUserAccountDetails } from "@/lib/data/account";

export async function GET() {
  const data = await getUserAccountDetails();

  if (!data) {
    return NextResponse.json(
      { error: "Unauthorized or User not found" },
      { status: 401 }
    );
  }

  return NextResponse.json(data);
}
