"use client";

import { COMFORT_PRIORITIES, FABRICS, FASHION_STYLES } from "@/lib/survey/options";
import { MultiChoice } from "./choice-group";
import { Question } from "./question";
import type { StepProps } from "./types";

/** Small CSS "fabric swatches" so the fabric choice feels visual and tactile. */
const FABRIC_TEXTURES: Record<string, React.CSSProperties> = {
  cotton: { background: "radial-gradient(circle at 30% 30%, #ffffff, #efe9e1)" },
  linen: {
    backgroundColor: "#e6d8c3",
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(120,90,60,.12) 0 1px, transparent 1px 4px)",
  },
  cotton_blend: {
    backgroundColor: "#f1e7e4",
    backgroundImage: "repeating-linear-gradient(45deg, rgba(107,30,54,.08) 0 2px, transparent 2px 5px)",
  },
  satin: { background: "linear-gradient(135deg, #5a1830 0%, #a24a64 45%, #5a1830 70%, #8a3550 100%)" },
  ribbed_knit: {
    backgroundColor: "#d9c9b6",
    backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.45) 0 2px, rgba(0,0,0,.06) 2px 4px)",
  },
  polyester_blend: { background: "linear-gradient(160deg, #c9cfd8, #eef0f3 55%, #b9c1cc)" },
  other: { background: "conic-gradient(#e9c46a, #d9a5a5, #a3b18a, #9cb3c9, #e9c46a)" },
};

export function StepStyle({ state, update, errors }: StepProps) {
  return (
    <div className="space-y-12">
      <Question
        id="fashion-styles"
        title="Which fashion styles do you love?"
        hint="Choose as many as you like."
        error={errors.fashion_styles}
      >
        <MultiChoice
          label="Fashion styles"
          options={FASHION_STYLES}
          value={state.fashion_styles}
          onChange={(fashion_styles) => update({ fashion_styles })}
          className="sm:grid-cols-2 lg:grid-cols-3"
          otherText={state.other_details.fashion_styles}
          onOtherTextChange={(v) => update((s) => ({ other_details: { ...s.other_details, fashion_styles: v } }))}
          otherPlaceholder="Describe your style (optional)"
        />
      </Question>

      <Question id="fabrics" title="Which fabrics do you prefer?" hint="Select all that apply." optional error={errors.fabric_preferences}>
        <MultiChoice
          label="Fabric preferences"
          options={FABRICS}
          value={state.fabric_preferences}
          onChange={(fabric_preferences) => update({ fabric_preferences })}
          className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          leading={(o) => (
            <span aria-hidden className="size-8 shrink-0 rounded-full border border-black/10 shadow-inner" style={FABRIC_TEXTURES[o.value]} />
          )}
          otherText={state.other_details.fabrics}
          onOtherTextChange={(v) => update((s) => ({ other_details: { ...s.other_details, fabrics: v } }))}
          otherPlaceholder="Which fabric? (optional)"
        />
      </Question>

      <Question
        id="comfort"
        title="What matters most when choosing clothing?"
        hint="Select all that apply."
        optional
        error={errors.comfort_preferences}
      >
        <MultiChoice
          variant="chip"
          label="What matters most"
          options={COMFORT_PRIORITIES}
          value={state.comfort_preferences}
          onChange={(comfort_preferences) => update({ comfort_preferences })}
        />
      </Question>
    </div>
  );
}

