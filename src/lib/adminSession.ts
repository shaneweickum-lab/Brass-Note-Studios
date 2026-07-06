// Edge Runtime compatible (Web Crypto API only — no Node.js imports)

export const ADMIN_COOKIE = "bns_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const TOKEN_SALT = ":bns-admin-session-v1";

/** Validate a session token in Edge Runtime (middleware). Async — uses Web Crypto. */
export async function isValidSessionTokenEdge(token: string): Promise<boolean> {
  if (!token) return false;
  const user = process.env.ADMIN_USER ?? "";
  const pass = process.env.ADMIN_PASS ?? "";
  const data = new TextEncoder().encode(`${user}:${pass}${TOKEN_SALT}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(buf);
  let expected = "";
  for (let i = 0; i < bytes.length; i++) {
    expected += bytes[i].toString(16).padStart(2, "0");
  }
  if (token.length !== expected.length) return false;
  // Constant-time comparison
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
