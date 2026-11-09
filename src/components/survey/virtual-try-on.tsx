"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, ChevronDown, ImageOff, Info, Lock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicDesign } from "./types";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/**
 * Optional virtual try-on (placeholder).
 *
 * No AI try-on provider is configured yet, so this NEVER claims to generate a
 * try-on image. The participant's photo is kept in browser memory only (object
 * URL): it is not uploaded, stored or sent anywhere, and it is discarded when
 * removed or when the page is closed. It never affects survey submission.
 *
 * To integrate a real provider later, call a server route (see
 * src/app/api/try-on/route.ts) so API keys stay on the server, and only after
 * explicit consent.
 */
export function VirtualTryOn({ designs }: { designs: PublicDesign[] }) {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(designs[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const design = designs.find((d) => d.id === designId) ?? designs[0];

  // Release the in-memory photo when it changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const onFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) return setError("Please choose a JPG, PNG or WebP photo.");
    if (file.size > MAX_BYTES) return setError("Please choose a photo smaller than 10 MB.");
    setPhotoUrl(URL.createObjectURL(file));
    if (inputRef.current) inputRef.current.value = "";
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    setError(null);
  };

  return (
    <section aria-labelledby="tryon-title" className="overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-blush/70 via-card to-cream">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="tryon-panel"
        className="flex w-full items-start gap-4 p-5 text-left sm:items-center sm:p-7"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-wine text-ivory">
          <Camera className="size-5" />
        </span>
        <span className="flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span id="tryon-title" className="font-serif text-2xl leading-tight font-medium">
              Want to See How It Looks on You?
            </span>
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-[0.15em] text-muted-foreground uppercase">
              Optional
            </span>
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Upload your photo and preview a selected clothing design. This feature is completely optional.
          </span>
        </span>
        <ChevronDown className={cn("mt-1 size-5 shrink-0 text-muted-foreground transition-transform sm:mt-0", open && "rotate-180")} />
      </button>

      {open && (
        <div id="tryon-panel" className="space-y-5 border-t border-border/60 p-5 animate-in fade-in-0 sm:p-7">
          <div className="flex gap-3 rounded-2xl bg-white/70 p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-wine" />
            <div className="space-y-1.5 text-muted-foreground">
              <p className="font-medium text-ink">AI try-on is coming soon. This is a preview only.</p>
              <p>
                We have not enabled AI virtual try-on yet, so no try-on image is generated. You&apos;ll see your photo
                side by side with the design to help you picture it.
              </p>
              <p className="flex items-start gap-1.5">
                <Lock className="mt-0.5 size-3.5 shrink-0" />
                Your photo stays on your device. It is <strong className="font-medium text-ink">never uploaded or stored</strong>,
                and it is deleted when you remove it or close this page.
              </p>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (!e.target.checked) removePhoto();
              }}
              className="mt-0.5 size-4 shrink-0 accent-[#6b1e36]"
            />
            <span>I understand how my photo is handled and agree to use it for this on-device preview.</span>
          </label>

          <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
            <div className="space-y-3">
              <p className="text-sm font-medium">Your photo</p>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-dashed border-taupe/60 bg-white/60">
                {photoUrl ? (
                  // Object URLs can't go through next/image optimisation.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt="Your uploaded photo" className="absolute inset-0 size-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted-foreground">
                    <div className="space-y-3">
                      <ImageOff className="mx-auto size-8 text-taupe" strokeWidth={1.25} />
                      <p>{consent ? "Choose a clear, front-facing photo." : "Tick the consent box to upload a photo."}</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED.join(",")}
                className="sr-only"
                id="tryon-file"
                disabled={!consent}
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <div className="flex flex-wrap gap-2">
                <label
                  htmlFor="tryon-file"
                  aria-disabled={!consent}
                  className={cn(
                    "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-ink px-4 text-sm text-ivory transition-colors hover:bg-wine",
                    !consent && "pointer-events-none opacity-40",
                  )}
                >
                  <Camera className="size-4" /> {photoUrl ? "Change photo" : "Upload photo"}
                </label>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" /> Remove photo
                  </button>
                )}
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Design</p>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream">
                {design?.image_url && (
                  <Image src={design.image_url} alt={design.design_name} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
                )}
                <span className="absolute inset-x-3 top-3 rounded-full bg-ink/80 px-3 py-1.5 text-center text-[0.7rem] font-medium tracking-wide text-ivory backdrop-blur">
                  Preview only · AI try-on not enabled yet
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" role="radiogroup" aria-label="Choose a design to preview">
                {designs.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    role="radio"
                    aria-checked={d.id === design?.id}
                    aria-label={d.design_name}
                    onClick={() => setDesignId(d.id)}
                    className={cn(
                      "relative aspect-[3/4] w-12 shrink-0 overflow-hidden rounded-lg border-2 bg-cream transition",
                      d.id === design?.id ? "border-wine" : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    {d.image_url && <Image src={d.image_url} alt="" fill sizes="48px" className="object-cover" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

