import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getWaitlistCount, getWaitlistEntries } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = getWaitlistEntries();
  return NextResponse.json({
    count: getWaitlistCount(),
    entries,
  });
}
