import Image from "next/image";
import { siteConfig } from "@/config/site";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <header className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-cream/60 via-background to-background">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-wine uppercase sm:text-3xl">
              {siteConfig.brandName}
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="text-xs tracking-wider text-muted-foreground uppercase">{siteConfig.brandTagline}</span>
          </div>

          <p className="eyebrow">First Collection · Market Research</p>

          <h1 className="text-4xl leading-[1.08] font-normal sm:text-5xl lg:text-6xl">
            Help Us Create Your <span className="italic">Next Favorite Outfit</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We&apos;re preparing our first women&apos;s fashion collection and would love to understand your preferences.
            Explore our designs and share your thoughts to help us create a collection you&apos;ll love.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex h-12 items-center justify-center rounded-full bg-wine px-8 text-base font-medium text-ivory shadow-[0_12px_28px_-10px_rgba(107,30,54,0.55)] transition-all hover:bg-wine-dark hover:shadow-[0_16px_36px_-12px_rgba(107,30,54,0.65)] focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              Explore the Collection
            </button>
            <span className="text-xs text-muted-foreground">Takes 3–5 minutes</span>
          </div>
        </div>

        <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-border/70 shadow-lg lg:aspect-[4/5]">
          <Image
            src="/images/hero.jpg"
            alt="Sri Lankan model wearing ÉLARA burgundy satin blouse and tailored trousers"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-ivory/90 p-3.5 backdrop-blur">
            <p className="text-[0.7rem] tracking-wider text-muted-foreground uppercase">Upcoming preview</p>
            <p className="font-serif text-base font-medium sm:text-lg">Casual Tops · Blouses · Dresses</p>
          </div>
        </div>
      </div>
    </header>
  );
}

