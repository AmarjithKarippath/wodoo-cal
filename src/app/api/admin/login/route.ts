import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminCredentials,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const username = String(body.username || "");
  const password = String(body.password || "");

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  const cookie = adminCookieOptions(createAdminSessionToken());
  response.cookies.set(cookie);
  return response;
}
