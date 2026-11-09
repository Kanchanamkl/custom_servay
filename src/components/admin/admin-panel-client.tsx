"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  Shirt,
  Lock,
  LogOut,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { loginAction, logoutAction } from "@/lib/admin/actions";
import type { SurveyAnalytics } from "@/lib/analytics";
import type { ClothingDesign, SurveyResponse } from "@/lib/data/types";
import { AnalyticsView } from "./analytics-view";
import { ResponsesView } from "./responses-view";
import { DesignsView } from "./designs-view";

type Tab = "analytics" | "responses" | "designs";

export function AdminPanelClient({
  isAuthenticated,
  analytics,
  responses,
  designs,
  exportToken,
}: {
  isAuthenticated: boolean;
  analytics: SurveyAnalytics;
  responses: SurveyResponse[];
  designs: ClothingDesign[];
  exportToken?: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoggingIn(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await loginAction(fd);
      if (res.ok) {
        toast.success("Welcome back, Administrator");
      } else {
        toast.error(res.error || "Invalid credentials");
      }
    } catch {
      toast.error("Failed to authenticate");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAction();
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-border/80 bg-card p-6 shadow-md sm:p-8">
          <div className="text-center">
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-wine uppercase">
              {siteConfig.brandName}
            </span>
            <h1 className="mt-2 font-serif text-3xl font-medium text-ink">Admin Panel</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Sign in to manage designs and review fashion market research results.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-username-input" className="block text-xs font-medium text-muted-foreground">
                Username
              </label>
              <input
                id="admin-username-input"
                name="username"
                type="text"
                required
                defaultValue="admin"
                className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition focus:border-wine/50 focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div>
              <label htmlFor="admin-password-input" className="block text-xs font-medium text-muted-foreground">
                Password
              </label>
              <input
                id="admin-password-input"
                name="password"
                type="password"
                required
                defaultValue="loopz@2027"
                className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none transition focus:border-wine/50 focus:ring-2 focus:ring-ring/20"
              />
              {/* <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
                Default: <code className="bg-sand/60 px-1 py-0.5 rounded text-ink">admin</code> /{" "}
                <code className="bg-sand/60 px-1 py-0.5 rounded text-ink">loopz@2027</code>
              </p> */}
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-wine text-sm font-medium text-ivory shadow-sm transition hover:bg-wine-dark disabled:opacity-50"
            >
              {loggingIn ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
              {loggingIn ? "Signing In…" : "Access Admin Panel"}
            </button>
          </form>

          <div className="border-t border-border/80 pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-wine"
            >
              Return to Public Survey <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin-pannel" className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-wine uppercase">
                {siteConfig.brandName}
              </span>
              <span className="rounded-md bg-sand/60 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider text-ink uppercase">
                Admin
              </span>
            </Link>

            {/* Public Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1 text-xs text-muted-foreground transition hover:text-wine sm:inline-flex"
            >
              View Public Survey <ExternalLink className="size-3" />
            </Link>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 rounded-full border border-border/80 bg-background p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${activeTab === "analytics"
                ? "bg-wine text-ivory shadow-xs"
                : "text-muted-foreground hover:text-ink"
                }`}
            >
              <BarChart3 className="size-3.5" />
              <span>Insights</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("responses")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${activeTab === "responses"
                ? "bg-wine text-ivory shadow-xs"
                : "text-muted-foreground hover:text-ink"
                }`}
            >
              <ClipboardList className="size-3.5" />
              <span>Responses ({responses.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("designs")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition ${activeTab === "designs"
                ? "bg-wine text-ivory shadow-xs"
                : "text-muted-foreground hover:text-ink"
                }`}
            >
              <Shirt className="size-3.5" />
              <span>Designs ({designs.length})</span>
            </button>
          </nav>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-destructive"
            title="Sign Out"
          >
            {loggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {activeTab === "analytics" && <AnalyticsView analytics={analytics} />}
        {activeTab === "responses" && (
          <ResponsesView responses={responses} exportToken={exportToken} />
        )}
        {activeTab === "designs" && <DesignsView designs={designs} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {siteConfig.brandName} Market Research Admin · Confidential Business Intelligence
        </p>
      </footer>
    </div>
  );
}

