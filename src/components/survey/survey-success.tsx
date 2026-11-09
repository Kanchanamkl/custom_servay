import { Check, Heart, RotateCcw } from "lucide-react";
import { siteConfig } from "@/config/site";

export function SurveySuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24 animate-in fade-in-0 duration-500">
      <div className="relative mx-auto mb-6 grid size-20 place-items-center rounded-full bg-blush text-wine shadow-[0_12px_28px_-8px_rgba(107,30,54,0.4)]">
        <Check className="size-10" strokeWidth={2.5} />
        <span className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-wine text-ivory">
          <Heart className="size-3.5 fill-ivory" />
        </span>
      </div>

      <p className="eyebrow">{siteConfig.brandName}</p>
      <h2 className="mt-2 font-serif text-3xl font-normal sm:text-5xl">
        Thank you for helping us create a collection you&apos;ll love!
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
        We&apos;ve recorded your preferences. Your feedback directly shapes which designs, colours, and sizes we
        purchase for our first batch.
      </p>

      <div className="mt-8 rounded-2xl border border-border/80 bg-card p-6 text-left text-sm text-muted-foreground">
        <p className="font-serif text-lg font-medium text-ink">What happens next?</p>
        <ul className="mt-3 list-inside list-disc space-y-1.5">
          <li>We aggregate survey responses to pick the winning designs.</li>
          <li>We adjust colourways and size curves according to demand.</li>
          <li>If you opted in for updates, we will let you know when pre-orders open!</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium transition hover:border-wine hover:text-wine"
        >
          <RotateCcw className="size-4" /> Submit another response
        </button>
      </div>
    </div>
  );
}

