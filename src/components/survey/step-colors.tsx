"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Heart, Shirt } from "lucide-react";
import { formatLkr } from "@/lib/format";
import { CATEGORIES, DRESS_LENGTHS, labelOf, NECKLINES, SLEEVE_STYLES, TOP_LENGTHS } from "@/lib/survey/options";
import { cn } from "@/lib/utils";
import { SingleChoice } from "./choice-group";
import { ColorSwatches } from "./color-swatches";
import type { DesignSelection, StepProps } from "./types";

export function StepColors({ state, update, errors, designs }: StepProps) {
  const byId = new Map(designs.map((d) => [d.id, d]));

  const patch = (id: string, p: Partial<DesignSelection>) =>
    update((s) => ({ designs: s.designs.map((d) => (d.design_id === id ? { ...d, ...p } : d)) }));

  return (
    <div className="space-y-4">
      {state.designs.map((sel, index) => {
        const design = byId.get(sel.design_id);
        if (!design) return null;
        const error = errors[`designs.${index}.colors`];
        return (
          <DesignPreferences
            key={sel.design_id}
            selection={sel}
            name={design.design_name}
            category={design.category}
            image={design.image_url}
            price={formatLkr(design.estimated_price_min, design.estimated_price_max)}
            error={error}
            onChange={(p) => patch(sel.design_id, p)}
          />
        );
      })}
    </div>
  );
}

function DesignPreferences({
  selection,
  name,
  category,
  image,
  price,
  error,
  onChange,
}: {
  selection: DesignSelection;
  name: string;
  category: string;
  image: string | null;
  price: string;
  error?: string;
  onChange: (p: Partial<DesignSelection>) => void;
}) {
  const hasDetails = Object.values(selection.customization).some(Boolean);
  const [open, setOpen] = useState(hasDetails);
  const lengths = category === "dresses" ? DRESS_LENGTHS : TOP_LENGTHS;
  const setCustom = (key: keyof DesignSelection["customization"], v: string | null) =>
    onChange({ customization: { ...selection.customization, [key]: v ?? undefined } });

  return (
    <article
      data-error={error ? "true" : undefined}
      className={cn(
        "rounded-2xl border bg-card p-4 shadow-sm transition-colors sm:p-5",
        error ? "border-destructive/50" : "border-border/80",
      )}
    >
      <div className="flex gap-4 sm:gap-6">
        <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl bg-cream sm:w-28">
          {image ? (
            <Image src={image} alt={name} fill sizes="112px" className="object-cover" />
          ) : (
            <Shirt className="absolute inset-0 m-auto size-8 text-taupe" strokeWidth={1} />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="eyebrow !text-[0.6rem] text-muted-foreground">{labelOf(CATEGORIES, category)}</p>
            <h3 className="mt-1 flex items-center gap-2 text-xl leading-tight font-medium sm:text-2xl">
              {name}
              {selection.is_favorite && <Heart aria-label="Favourite" className="size-4 shrink-0 fill-wine text-wine" />}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Est. {price}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Preferred colours</p>
            <ColorSwatches label={`Preferred colours for ${name}`} value={selection.colors} onChange={(colors) => onChange({ colors })} />
            {selection.colors.includes("other") && (
              <input
                type="text"
                value={selection.other_color}
                maxLength={60}
                onChange={(e) => onChange({ other_color: e.target.value })}
                placeholder="Which other colour? (optional)"
                aria-label={`Other colour for ${name}`}
                className="mt-1 h-10 w-full max-w-sm rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-wine/50 focus:ring-3 focus:ring-ring/20"
              />
            )}
            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border/70 pt-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 py-1 text-sm text-muted-foreground transition-colors hover:text-wine"
        >
          <span>
            Style details <span className="text-xs">(optional)</span>
          </span>
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="mt-3 grid gap-4 animate-in fade-in-0 slide-in-from-top-1 sm:grid-cols-3">
            <Detail label="Sleeve">
              <SingleChoice variant="chip" allowDeselect label={`Sleeve style for ${name}`} options={SLEEVE_STYLES} value={selection.customization.sleeve ?? null} onChange={(v) => setCustom("sleeve", v)} />
            </Detail>
            <Detail label="Neckline">
              <SingleChoice variant="chip" allowDeselect label={`Neckline for ${name}`} options={NECKLINES} value={selection.customization.neckline ?? null} onChange={(v) => setCustom("neckline", v)} />
            </Detail>
            <Detail label="Length">
              <SingleChoice variant="chip" allowDeselect label={`Length for ${name}`} options={lengths} value={selection.customization.length ?? null} onChange={(v) => setCustom("length", v)} />
            </Detail>
          </div>
        )}
      </div>
    </article>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-[0.15em] text-muted-foreground uppercase">{label}</p>
      <div className="[&_button]:min-h-8 [&_button]:px-3 [&_button]:text-xs">{children}</div>
    </div>
  );
}

