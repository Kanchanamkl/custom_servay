import { CheckCircle2, HeartHandshake, Palette, Sparkles, Tag } from "lucide-react";

const STEPS = [
  { icon: Sparkles, title: "Choose your favorite designs", description: "Browse our 12 debut pieces and select the styles you would wear." },
  { icon: Palette, title: "Select your preferred colors", description: "Tell us which colourways and design details suit you best." },
  { icon: Tag, title: "Share your price preferences", description: "Let us know what price point feels reasonable and accessible." },
  { icon: HeartHandshake, title: "Help shape our first collection", description: "Your input directly decides what we produce in batch one." },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="border-b border-border/80 bg-card py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="eyebrow">A 4-step survey</p>
          <h2 id="how-it-works-title" className="mt-1 font-serif text-3xl font-medium sm:text-4xl">
            How Your Input Shapes the Collection
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="relative rounded-2xl border border-border/70 bg-background p-6">
                <span className="font-serif text-3xl font-light text-taupe/60 sm:text-4xl">0{i + 1}</span>
                <span className="mt-3 grid size-10 place-items-center rounded-xl bg-blush text-wine">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-serif text-xl font-medium">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-4 text-wine" /> No registration or account needed.
        </div>
      </div>
    </section>
  );
}

