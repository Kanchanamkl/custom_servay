"use client";

import Image from "next/image";
import { Check, Heart, Plus, Shirt } from "lucide-react";
import { formatLkr } from "@/lib/format";
import { CATEGORIES, labelOf } from "@/lib/survey/options";
import { cn } from "@/lib/utils";
import type { PublicDesign } from "./types";

type DesignCardProps = {
  design: PublicDesign;
  selected: boolean;
  favorite: boolean;
  onToggleSelect: () => void;
  onToggleFavorite: () => void;
  priority?: boolean;
};

export function DesignCard({ design, selected, favorite, onToggleSelect, onToggleFavorite, priority }: DesignCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300",
        selected
          ? "border-wine shadow-[0_10px_30px_-12px_rgba(107,30,54,0.45)] ring-1 ring-wine"
          : "border-border/80 shadow-sm hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(43,29,33,0.35)]",
      )}
    >
      <button
        type="button"
        onClick={onToggleSelect}
        aria-label={`${selected ? "Deselect" : "Select"} ${design.design_name}`}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-cream outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        {design.image_url ? (
          <Image
            src={design.image_url}
            alt={design.design_name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-taupe">
            <Shirt className="size-12" strokeWidth={1} />
          </span>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-ivory/90 px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.18em] text-ink uppercase backdrop-blur">
          {labelOf(CATEGORIES, design.category)}
        </span>
        <span
          className={cn(
            "absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-wine px-2.5 py-1 text-xs font-medium text-ivory transition-all duration-300",
            selected ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <Check className="size-3" strokeWidth={3} /> Selected
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleFavorite}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${design.design_name} from favourites` : `Mark ${design.design_name} as a favourite`}
        className={cn(
          "absolute top-2.5 right-2.5 grid size-9 place-items-center rounded-full bg-ivory/90 shadow-sm backdrop-blur transition-transform outline-none hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/40",
          favorite && "bg-white",
        )}
      >
        <Heart className={cn("size-[18px] transition-colors", favorite ? "fill-wine text-wine" : "text-ink")} />
      </button>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-lg leading-snug font-medium text-ink sm:text-xl">{design.design_name}</h3>
        {design.description && (
          <p className="mt-1 line-clamp-2 hidden text-xs text-muted-foreground sm:block">{design.description}</p>
        )}
        <p className="mt-1.5 text-xs font-medium tracking-wide text-wine/90 sm:text-[0.8rem]">
          Est. {formatLkr(design.estimated_price_min, design.estimated_price_max)}
        </p>
        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={onToggleSelect}
            aria-pressed={selected}
            className={cn(
              "flex h-9 w-full items-center justify-center gap-1.5 rounded-full border text-xs font-medium tracking-wide transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40 sm:text-sm",
              selected
                ? "border-wine bg-wine text-ivory hover:bg-wine-dark"
                : "border-ink/15 bg-transparent text-ink hover:border-wine hover:text-wine",
            )}
          >
            {selected ? (
              <>
                <Check className="size-3.5" strokeWidth={3} /> Selected
              </>
            ) : (
              <>
                <Plus className="size-3.5" /> Select design
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

