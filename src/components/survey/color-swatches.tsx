"use client";

import { Check } from "lucide-react";
import { COLORS } from "@/lib/survey/options";
import { cn } from "@/lib/utils";

const LIGHT = new Set(["white", "beige", "dusty_pink", "sage_green"]);

/** Multi-select colour swatches. */
export function ColorSwatches({
  value,
  onChange,
  label,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
}) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-x-3 gap-y-3 sm:gap-x-4">
      {COLORS.map((c) => {
        const checked = value.includes(c.value);
        return (
          <button
            key={c.value}
            type="button"
            role="checkbox"
            aria-checked={checked}
            aria-label={c.label}
            onClick={() => toggle(c.value)}
            className="group flex w-14 flex-col items-center gap-1.5 outline-none"
          >
            <span
              className={cn(
                "relative grid size-10 place-items-center rounded-full border shadow-inner transition-all duration-200 sm:size-11",
                "group-focus-visible:ring-3 group-focus-visible:ring-ring/40",
                c.value === "white" ? "border-taupe/60" : "border-black/10",
                checked ? "scale-105 ring-2 ring-wine ring-offset-2 ring-offset-card" : "group-hover:scale-105",
              )}
              style={{ background: c.hex }}
            >
              {checked && (
                <Check
                  aria-hidden
                  strokeWidth={3}
                  className={cn("size-4", LIGHT.has(c.value) || c.value === "other" ? "text-ink" : "text-white")}
                />
              )}
            </span>
            <span className={cn("text-center text-[0.7rem] leading-tight", checked ? "font-medium text-wine" : "text-muted-foreground")}>
              {c.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

