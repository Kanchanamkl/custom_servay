"use client";

import { ShieldCheck } from "lucide-react";
import { labelOf, FITS } from "@/lib/survey/options";
import { cn } from "@/lib/utils";
import { SingleChoice } from "./choice-group";
import { Question } from "./question";
import type { StepProps } from "./types";

const YES_NO = [
  { value: "yes", label: "Yes, keep me posted" },
  { value: "no", label: "No, thank you" },
] as const;

export function StepDetails({
  state,
  update,
  errors,
  honeypot,
  onHoneypotChange,
}: StepProps & { honeypot: string; onHoneypotChange: (v: string) => void }) {
  const favorites = state.designs.filter((d) => d.is_favorite).length;

  return (
    <div className="space-y-10">
      <div className="flex gap-3 rounded-2xl border border-wine/15 bg-blush/50 p-4 text-sm">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-wine" />
        <p className="text-wine-dark">
          Your information will only be used for fashion research and survey-related communication.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="full_name" label="Full name" error={errors.full_name}>
          <input
            id="full_name"
            type="text"
            autoComplete="name"
            value={state.full_name}
            maxLength={120}
            onChange={(e) => update({ full_name: e.target.value })}
            aria-invalid={!!errors.full_name}
            aria-describedby={errors.full_name ? "full_name-error" : undefined}
            placeholder="e.g. Nethmi Perera"
            className={inputClass(!!errors.full_name)}
          />
        </Field>
        <Field id="mobile_number" label="Mobile number" optional error={errors.mobile_number}>
          <input
            id="mobile_number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={state.mobile_number}
            maxLength={20}
            onChange={(e) => update({ mobile_number: e.target.value })}
            aria-invalid={!!errors.mobile_number}
            aria-describedby={errors.mobile_number ? "mobile_number-error" : undefined}
            placeholder="07X XXX XXXX"
            className={inputClass(!!errors.mobile_number)}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from people and screen readers, often filled by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => onHoneypotChange(e.target.value)} />
      </div>
      {/* 
      <Question
        id="updates"
        title="Would you like to receive updates about our first collection?"
        hint="We'll only contact you if you choose Yes. You can opt out at any time."
        error={errors.launch_updates_consent}
      >
        <SingleChoice
          label="Receive collection updates"
          options={YES_NO}
          value={state.launch_updates_consent === null ? null : state.launch_updates_consent ? "yes" : "no"}
          onChange={(v) => update({ launch_updates_consent: v === null ? null : v === "yes" })}
          className="sm:grid-cols-2"
        />
      </Question> */}

      <div className="rounded-2xl border border-border/80 bg-card p-5">
        <p className="eyebrow !text-muted-foreground">Your summary</p>
        <dl className="mt-3 grid grid-cols-3 gap-4 text-center">
          <Stat label="Designs" value={state.designs.length} />
          <Stat label="Favourites" value={favorites} />
          <Stat label="Preferred Fit" value={state.preferred_fit ? labelOf(FITS, state.preferred_fit) : "—"} small />
        </dl>
      </div>
    </div>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "h-12 w-full rounded-xl border bg-card px-4 text-base outline-none transition placeholder:text-muted-foreground/70 focus:ring-3",
    invalid ? "border-destructive/60 focus:ring-destructive/15" : "border-input focus:border-wine/50 focus:ring-ring/20",
  );
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2" data-error={error ? "true" : undefined}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}{" "}
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        ) : (
          <span className="text-wine">*</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: React.ReactNode; small?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 font-serif font-semibold text-wine", small ? "text-lg" : "text-3xl")}>{value}</dd>
    </div>
  );
}

