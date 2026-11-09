"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Option } from "@/lib/survey/options";

type Variant = "tile" | "chip";

type ChoiceButtonProps = {
  option: Option;
  checked: boolean;
  role: "checkbox" | "radio";
  variant: Variant;
  onClick: () => void;
  leading?: React.ReactNode;
};

function ChoiceButton({ option, checked, role, variant, onClick, leading }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      onClick={onClick}
      className={cn(
        "group relative flex items-center text-left transition-all duration-200 outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/40",
        variant === "tile" &&
          "min-h-14 w-full gap-3 rounded-xl border bg-card px-4 py-3 hover:border-wine/40 hover:shadow-sm",
        variant === "chip" && "min-h-10 gap-2 rounded-full border bg-card px-4 py-2 text-sm hover:border-wine/40",
        checked ? "border-wine bg-blush/60 text-wine-dark shadow-sm" : "border-border text-foreground",
      )}
    >
      {leading}
      <span className="flex-1">
        <span className={cn("block font-medium", variant === "chip" && "font-normal")}>{option.label}</span>
        {variant === "tile" && option.description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">{option.description}</span>
        )}
      </span>
      {variant === "tile" && (
        <span
          aria-hidden
          className={cn(
            "grid size-5 shrink-0 place-items-center border transition-colors",
            role === "radio" ? "rounded-full" : "rounded-md",
            checked ? "border-wine bg-wine text-ivory" : "border-taupe/60 bg-white",
          )}
        >
          {checked && <Check className="size-3.5" strokeWidth={3} />}
        </span>
      )}
      {variant === "chip" && checked && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
    </button>
  );
}

type BaseProps = {
  options: readonly Option[];
  variant?: Variant;
  className?: string;
  label: string;
  /** Optional free-text box shown when the "other" option is selected. */
  otherText?: string;
  onOtherTextChange?: (value: string) => void;
  otherPlaceholder?: string;
  leading?: (option: Option) => React.ReactNode;
};

function OtherInput({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder?: string; label: string }) {
  return (
    <input
      type="text"
      value={value}
      maxLength={120}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Tell us more (optional)"}
      aria-label={`${label}: other (please specify)`}
      className="mt-3 h-11 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-wine/50 focus:ring-3 focus:ring-ring/20 animate-in fade-in-0 slide-in-from-top-1"
    />
  );
}

export function MultiChoice({
  options,
  value,
  onChange,
  variant = "tile",
  className,
  label,
  otherText,
  onOtherTextChange,
  otherPlaceholder,
  leading,
}: BaseProps & { value: string[]; onChange: (value: string[]) => void }) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div>
      <div role="group" aria-label={label} className={cn(variant === "chip" ? "flex flex-wrap gap-2" : "grid gap-3", className)}>
        {options.map((o) => (
          <ChoiceButton
            key={o.value}
            option={o}
            role="checkbox"
            variant={variant}
            checked={value.includes(o.value)}
            onClick={() => toggle(o.value)}
            leading={leading?.(o)}
          />
        ))}
      </div>
      {onOtherTextChange && value.includes("other") && (
        <OtherInput value={otherText ?? ""} onChange={onOtherTextChange} placeholder={otherPlaceholder} label={label} />
      )}
    </div>
  );
}

export function SingleChoice({
  options,
  value,
  onChange,
  variant = "tile",
  className,
  label,
  allowDeselect = false,
  leading,
}: BaseProps & { value: string | null; onChange: (value: string | null) => void; allowDeselect?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn(variant === "chip" ? "flex flex-wrap gap-2" : "grid gap-3", className)}>
      {options.map((o) => (
        <ChoiceButton
          key={o.value}
          option={o}
          role="radio"
          variant={variant}
          checked={value === o.value}
          onClick={() => onChange(value === o.value && allowDeselect ? null : o.value)}
          leading={leading?.(o)}
        />
      ))}
    </div>
  );
}

