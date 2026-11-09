"use client";

import { useRef } from "react";
import { Hero } from "@/components/survey/hero";
import { HowItWorks } from "@/components/survey/how-it-works";
import { SurveyWizard } from "@/components/survey/survey-wizard";
import type { PublicDesign } from "@/components/survey/types";
import { siteConfig } from "@/config/site";

export function SurveyHomeClient({ designs }: { designs: PublicDesign[] }) {
  const wizardRef = useRef<HTMLDivElement>(null);

  const scrollToWizard = () => {
    wizardRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Hero onStart={scrollToWizard} />
      <HowItWorks />
      <main ref={wizardRef} className="flex-1">
        <SurveyWizard designs={designs} />
      </main>
      <footer className="border-t border-border/80 bg-card py-8 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved. Market research preview.
        </p>
      </footer>
    </div>
  );
}

