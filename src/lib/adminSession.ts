import { createHash, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "bns_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function computeSessionToken(): string {
  const user = process.env.ADMIN_USER ?? "";
  const pass = process.env.ADMIN_PASS ?? "";
  return createHash("sha256")
    .update(`${user}:${pass}:bns-admin-session-v1`)
    .digest("hex");
}

export function isValidSessionToken(token: string): boolean {
  if (!token) return false;
  const expected = computeSessionToken();
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}
