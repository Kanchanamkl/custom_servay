import "server-only";

/**
 * Admin panel (/admin-pannel) credentials.
 *
 * These are hardcoded defaults as requested. CHANGE THEM before sharing the
 * site. They can also be overridden with environment variables
 * (ADMIN_USERNAME / ADMIN_PASSWORD / ADMIN_SESSION_SECRET) without code changes.
 *
 * This file is server-only, so the values are never shipped to the browser.
 */
export const adminConfig = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "loopz@2027",
  /** Used to sign the admin session cookie. */
  sessionSecret:
    process.env.ADMIN_SESSION_SECRET || "elara-local-session-secret-change-me-7f3a9c1e5b",
  /** Session lifetime in seconds (8 hours). */
  sessionMaxAge: 60 * 60 * 8,
} as const;

/**
 * Secret path for the read-only analytics dashboard (no login).
 * Example: DASHBOARD_PATH=insights-x7k2p9  →  https://your-site/insights-x7k2p9
 * In development a default is used so you can open it straight away.
 */
export function getDashboardSlug(): string | null {
  const fromEnv = process.env.DASHBOARD_PATH?.trim().replace(/^\/+|\/+$/g, "");
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === "production" ? null : "insights-dev";
}

