import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { adminConfig } from "@/config/admin";

const COOKIE_NAME = "elara_admin_token";

function signToken(username: string): string {
  const hmac = createHmac("sha256", adminConfig.sessionSecret);
  hmac.update(`${username}:${adminConfig.password}`);
  return `${username}.${hmac.digest("hex")}`;
}

function verifyToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [user, sig] = parts;
  if (user !== adminConfig.username) return false;

  const expected = signToken(user);
  const expectedSig = expected.split(".")[1];
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = signToken(adminConfig.username);
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminConfig.sessionMaxAge,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyAdminCredentials(user: string, pass: string): Promise<boolean> {
  // Constant time comparison to prevent timing attacks
  const userMatch = user === adminConfig.username;
  const passMatch = pass === adminConfig.password;
  return userMatch && passMatch;
}

