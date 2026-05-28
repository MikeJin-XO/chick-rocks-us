// Shared-password auth for the owner dashboard. One env var (ADMIN_PASSWORD) gates
// access; on login we hand the browser an HMAC-signed expiry cookie so future
// requests don't need to round-trip the password.
import { cookies } from "next/headers";
import crypto from "node:crypto";

export const COOKIE_NAME = "chick-admin";
const SESSION_SECONDS = 7 * 24 * 60 * 60;

function secret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD is not set in the environment.");
  return s;
}

function hmac(message: string): string {
  return crypto.createHmac("sha256", secret()).update(message).digest("hex");
}

export function checkPassword(input: string): boolean {
  const expected = Buffer.from(secret());
  const actual = Buffer.from(input);
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export function buildSessionCookie(): { value: string; maxAge: number } {
  const exp = String(Date.now() + SESSION_SECONDS * 1000);
  return { value: `${exp}.${hmac(exp)}`, maxAge: SESSION_SECONDS };
}

function verifyCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot < 0) return false;
  const exp = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expMs = Number(exp);
  if (!Number.isFinite(expMs) || expMs < Date.now()) return false;
  const expected = hmac(exp);
  if (expected.length !== sig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return verifyCookieValue(c.get(COOKIE_NAME)?.value);
}
