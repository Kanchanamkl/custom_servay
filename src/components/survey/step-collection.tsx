"use client";

import { COLLECTION_PREFERENCES, SHOPPING_CHANNELS } from "@/lib/survey/options";
import { MultiChoice } from "./choice-group";
import { Question } from "./question";
import type { StepProps } from "./types";
import { VirtualTryOn } from "./virtual-try-on";

const FEEDBACK_MAX = 2000;

export function StepCollection({ state, update, errors, designs }: StepProps) {
  const selectedDesigns = state.designs
    .map((s) => designs.find((d) => d.id === s.design_id))
    .filter((d): d is (typeof designs)[number] => !!d);

  return (
    <div className="space-y-12">
      <Question
        id="collection"
        title="What types of clothing would you most like to see in our first collection?"
        hint="Choose as many as you like."
        error={errors.collection_preferences}
      >
        <MultiChoice
          label="Collection preferences"
          options={COLLECTION_PREFERENCES}
          value={state.collection_preferences}
          onChange={(collection_preferences) => update({ collection_preferences })}
          className="grid-cols-2 lg:grid-cols-3"
          otherText={state.other_details.collection}
          onOtherTextChange={(v) => update((s) => ({ other_details: { ...s.other_details, collection: v } }))}
          otherPlaceholder="What else would you like to see? (optional)"
        />
      </Question>

      <Question id="channels" title="Where do you usually buy women's clothing?" optional error={errors.shopping_channels}>
        <MultiChoice
          variant="chip"
          label="Shopping channels"
          options={SHOPPING_CHANNELS}
          value={state.shopping_channels}
          onChange={(shopping_channels) => update({ shopping_channels })}
          otherText={state.other_details.shopping_channels}
          onOtherTextChange={(v) => update((s) => ({ other_details: { ...s.other_details, shopping_channels: v } }))}
          otherPlaceholder="Where else? (optional)"
        />
      </Question>

      {/* <VirtualTryOn designs={selectedDesigns.length ? selectedDesigns : designs} /> */}

      <Question id="feedback" title="Any suggestions or feedback for our upcoming collection?" optional error={errors.feedback}>
        <div className="relative">
          <textarea
            id="feedback-input"
            aria-labelledby="feedback-title"
            value={state.feedback}
            maxLength={FEEDBACK_MAX}
            rows={5}
            onChange={(e) => update({ feedback: e.target.value })}
            placeholder="Tell us about designs, styles, colors, or additional clothing options you would love to see."
            className="w-full resize-y rounded-2xl border border-input bg-card p-4 text-sm leading-relaxed outline-none transition placeholder:text-muted-foreground focus:border-wine/50 focus:ring-3 focus:ring-ring/20"
          />
          <span className="pointer-events-none absolute right-4 bottom-3 text-xs text-muted-foreground">
            {state.feedback.length}/{FEEDBACK_MAX}
          </span>
        </div>
      </Question>
    </div>
  );
}

