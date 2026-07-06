import { NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/adminSession";

export function checkAdminAuth(req: NextRequest): boolean {
  // Session cookie (browser-initiated requests from admin pages)
  const token = req.cookies.get(ADMIN_COOKIE)?.value ?? "";
  if (token && isValidSessionToken(token)) return true;

  // Basic Auth fallback (external tools / CLI usage)
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
