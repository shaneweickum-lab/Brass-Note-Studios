// Node.js runtime only — never imported by middleware or other Edge code
import { NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ADMIN_COOKIE } from "@/lib/adminSession";

const TOKEN_SALT = ":bns-admin-session-v1";

/** Compute the expected session token using Node.js crypto (synchronous). */
export function computeSessionToken(): string {
  const user = process.env.ADMIN_USER ?? "";
  const pass = process.env.ADMIN_PASS ?? "";
  return createHash("sha256").update(`${user}:${pass}${TOKEN_SALT}`).digest("hex");
}

function isValidSessionToken(token: string): boolean {
  if (!token) return false;
  const expected = computeSessionToken();
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export function checkAdminAuth(req: NextRequest): boolean {
  // Session cookie (browser requests from logged-in admin pages)
  const token = req.cookies.get(ADMIN_COOKIE)?.value ?? "";
  if (token && isValidSessionToken(token)) return true;

  // Basic Auth fallback (external tools / CLI)
  const authHeader = req.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Basic ")) return false;
  const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
  const colonIdx = decoded.indexOf(":");
  if (colonIdx < 0) return false;
  const user = decoded.slice(0, colonIdx);
  const pass = decoded.slice(colonIdx + 1);
  const expectedUser = process.env.ADMIN_USER ?? "";
  const expectedPass = process.env.ADMIN_PASS ?? "";
  return Boolean(expectedUser && expectedPass && user === expectedUser && pass === expectedPass);
}

export const UNAUTHORIZED = new Response("Unauthorized", {
  status: 401,
  headers: { "WWW-Authenticate": 'Basic realm="BNS Admin"' },
});
