import { NextRequest, NextResponse } from "next/server";
import { addWaitlistEntry, emailExists, getWaitlistCount } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function displayCount(realCount: number) {
  const base = Number(process.env.WAITLIST_BASE_COUNT || 2400);
  return base + realCount;
}

export async function GET() {
  const realCount = getWaitlistCount();
  return NextResponse.json({
    count: displayCount(realCount),
    realCount,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = body.name ? String(body.name).trim() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (emailExists(email)) {
      return NextResponse.json(
        { error: "You're already on the list." },
        { status: 409 },
      );
    }

    const entry = addWaitlistEntry({
      email,
      name,
      userAgent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    });

    return NextResponse.json({
      ok: true,
      entry: {
        id: entry.id,
        email: entry.email,
        name: entry.name,
        created_at: entry.created_at,
      },
      count: displayCount(getWaitlistCount()),
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 },
    );
  }
}
