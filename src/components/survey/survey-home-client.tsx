"use client";

import { SurveyWizard } from "@/components/survey/survey-wizard";
import type { PublicDesign } from "@/components/survey/types";
import { siteConfig } from "@/config/site";
import { Sparkles, Clock, ShieldCheck } from "lucide-react";

export function SurveyHomeClient({ designs }: { designs: PublicDesign[] }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Streamlined Survey Header (Pure Research Survey Vibe) */}
      <header className="border-b border-border/70 bg-card/60 backdrop-blur-xs">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center sm:px-6 sm:py-8">
          <span className="font-serif text-2xl font-bold tracking-[0.25em] text-wine uppercase sm:text-3xl">
            {siteConfig.brandName}
          </span>
          <p className="mt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Women&apos;s Fashion Market Research Survey
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            We&apos;re planning our debut clothing collection. Select your favorite designs and share your thoughts to help us decide which pieces to stock first.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-wine" /> Takes 3–5 minutes
            </span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-wine" /> No account required
            </span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-wine" /> Shape our first batch
            </span>
          </div>
        </div>
      </header>

      {/* Direct Survey Wizard */}
      <main className="flex-1">
        <SurveyWizard designs={designs} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {siteConfig.brandName} · Market Research Survey · Colombo, Sri Lanka
        </p>
      </footer>
    </div>
  );
}
