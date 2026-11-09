"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { CATEGORIES } from "@/lib/survey/options";
import { cn } from "@/lib/utils";
import { DesignCard } from "./design-card";
import type { DesignSelection, StepProps } from "./types";

const FILTERS = [{ value: "all", label: "All Designs" }, ...CATEGORIES];

function getDefaultColor(name: string): string[] {
  const lower = name.toLowerCase();
  if (lower.includes("burgundy")) return ["burgundy"];
  if (lower.includes("sage")) return ["sage_green"];
  if (lower.includes("dusty pink") || lower.includes("pink")) return ["dusty_pink"];
  if (lower.includes("navy")) return ["navy_blue"];
  if (lower.includes("black")) return ["black"];
  if (lower.includes("white")) return ["white"];
  if (lower.includes("ivory")) return ["white"];
  if (lower.includes("beige") || lower.includes("linen")) return ["beige"];
  return ["beige"];
}

const newSelection = (design_id: string, design_name?: string, is_favorite = false): DesignSelection => ({
  design_id,
  is_favorite,
  colors: design_name ? getDefaultColor(design_name) : ["beige"],
  other_color: "",
  customization: {},
});

export function StepDesigns({ state, update, errors, designs }: StepProps) {
  const [filter, setFilter] = useState<string>("all");
  const visible = filter === "all" ? designs : designs.filter((d) => d.category === filter);
  const selectedIds = new Map(state.designs.map((d) => [d.design_id, d]));

  const toggleSelect = (id: string) => {
    const dObj = designs.find((d) => d.id === id);
    update((s) => ({
      designs: s.designs.some((d) => d.design_id === id)
        ? s.designs.filter((d) => d.design_id !== id)
        : [...s.designs, newSelection(id, dObj?.design_name)],
    }));
  };

  const toggleFavorite = (id: string) => {
    const dObj = designs.find((d) => d.id === id);
    update((s) => {
      const existing = s.designs.find((d) => d.design_id === id);
      if (!existing) return { designs: [...s.designs, newSelection(id, dObj?.design_name, true)] };
      return { designs: s.designs.map((d) => (d.design_id === id ? { ...d, is_favorite: !d.is_favorite } : d)) };
    });
  };

  if (designs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">
        Our designs are being updated. Please check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter designs by category">
        {FILTERS.map((f) => {
          const count = f.value === "all" ? designs.length : designs.filter((d) => d.category === f.value).length;
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.value)}
              className={cn(
                "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                active ? "border-ink bg-ink text-ivory" : "border-border bg-card text-ink hover:border-ink/40",
              )}
            >
              {f.label}
              <span className={cn("text-xs", active ? "text-ivory/70" : "text-muted-foreground")}>{count}</span>
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Heart className="size-4 fill-wine text-wine" /> Tap the heart on the designs you love most.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {visible.map((d, i) => {
          const sel = selectedIds.get(d.id);
          return (
            <DesignCard
              key={d.id}
              design={d}
              priority={i < 4}
              selected={!!sel}
              favorite={!!sel?.is_favorite}
              onToggleSelect={() => toggleSelect(d.id)}
              onToggleFavorite={() => toggleFavorite(d.id)}
            />
          );
        })}
      </div>

      {errors.designs && (
        <p role="alert" className="text-sm font-medium text-destructive" data-error="true">
          {errors.designs}
        </p>
      )}
    </div>
  );
}

