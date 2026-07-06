import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, COOKIE_MAX_AGE } from "@/lib/adminSession";
import { computeSessionToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    // malformed body — fall through to credential check which will fail
  }

  const { username, password } = body;
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASS ?? "";

  if (
    !expectedUser ||
    !expectedPass ||
    username !== expectedUser ||
    password !== expectedPass
  ) {
    // Fixed delay to blunt timing-based username enumeration
    await new Promise((r) => setTimeout(r, 300));
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = computeSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
