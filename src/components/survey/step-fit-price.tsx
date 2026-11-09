"use client";

import { FITS, PRICE_RANGES, SIZES } from "@/lib/survey/options";
import { cn } from "@/lib/utils";
import { SingleChoice } from "./choice-group";
import { Question } from "./question";
import type { StepProps } from "./types";

/* const INTENT_DOTS: Record<string, number> = {
  definitely: 5,
  probably: 4,
  not_sure: 3,
  probably_not: 2,
  definitely_not: 1,
}; */

export function StepFitPrice({ state, update, errors }: StepProps) {
  return (
    <div className="space-y-12">
      <Question
        id="price-range"
        title="What price range would you consider reasonable for the clothing designs you selected?"
        hint="Prices are per item, in Sri Lankan Rupees."
        error={errors.price_range}
      >
        <div role="radiogroup" aria-label="Preferred price range" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRICE_RANGES.map((p, i) => {
            const checked = state.price_range === p.value;
            return (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => update({ price_range: p.value })}
                className={cn(
                  "relative flex min-h-20 flex-col justify-center rounded-2xl border px-4 py-3 text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                  checked
                    ? "border-wine bg-wine text-ivory shadow-[0_10px_24px_-12px_rgba(107,30,54,0.6)]"
                    : "border-border bg-card hover:border-wine/40 hover:shadow-sm",
                )}
              >
                <span className={cn("text-[0.6rem] tracking-[0.2em] uppercase", checked ? "text-ivory/70" : "text-muted-foreground")}>
                  {"₨".repeat(Math.min(i + 1, 4))}
                </span>
                <span className="mt-1 font-serif text-lg leading-tight font-semibold sm:text-xl">{p.label}</span>
              </button>
            );
          })}
        </div>
      </Question>

      {/* <Question
        id="purchase-intention"
        title="If your preferred design were available at your selected price, how likely would you be to purchase it?"
        error={errors.purchase_intention}
      >
        <SingleChoice
          label="Purchase likelihood"
          options={PURCHASE_INTENTIONS}
          value={state.purchase_intention}
          onChange={(purchase_intention) => update({ purchase_intention })}
          className="sm:grid-cols-1"
          leading={(o) => (
            <span aria-hidden className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={cn("size-1.5 rounded-full", i < INTENT_DOTS[o.value] ? "bg-wine" : "bg-sand")}
                />
              ))}
            </span>
          )}
        />
      </Question> */}

      <div className="rounded-3xl border border-dashed border-taupe/50 bg-cream/60 p-5 sm:p-8">
        <p className="eyebrow">Optional · Size &amp; fit</p>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          This section is optional. Size information is used only in aggregate to decide which sizes to stock. It is
          never shared.
        </p>
        <div className="mt-8 space-y-10">
          <Question id="fit" title="Your preferred fit" optional error={errors.preferred_fit}>
            <SingleChoice
              allowDeselect
              label="Preferred fit"
              options={FITS}
              value={state.preferred_fit}
              onChange={(preferred_fit) => update({ preferred_fit })}
              className="grid-cols-2 lg:grid-cols-4"
            />
          </Question>
          <Question id="size" title="Your usual clothing size" optional error={errors.clothing_size}>
            <SingleChoice
              allowDeselect
              variant="chip"
              label="Usual clothing size"
              options={SIZES}
              value={state.clothing_size}
              onChange={(clothing_size) => update({ clothing_size })}
            />
          </Question>
        </div>
      </div>
    </div>
  );
}

