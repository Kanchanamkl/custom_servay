"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitSurvey } from "@/lib/survey/actions";
import { STEP_FIELDS, surveySchema, toFieldErrors, type FieldErrors } from "@/lib/survey/schema";
import { StepCollection } from "./step-collection";
import { StepColors } from "./step-colors";
import { StepDesigns } from "./step-designs";
import { StepDetails } from "./step-details";
import { StepFabricFit } from "./step-fabric-fit";
import { SurveySuccess } from "./survey-success";
import { initialSurveyState, toPayload, type PublicDesign, type SurveyState } from "./types";

const STEPS = [
  { title: "Select Designs", subtitle: "Choose the pieces you'd love to wear" },
  { title: "Colours & Details", subtitle: "Customise your selected designs" },
  { title: "Fabric & Fit", subtitle: "Tell us your material and fit preferences" },
  { title: "Collection & Ideas", subtitle: "What you want to see next" },
  { title: "Your Details", subtitle: "Where we can keep in touch" },
] as const;

export function SurveyWizard({ designs }: { designs: PublicDesign[] }) {
  const [state, setState] = useState<SurveyState>(initialSurveyState);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const update: (patch: Partial<SurveyState> | ((s: SurveyState) => Partial<SurveyState>)) => void = (patch) => {
    setState((prev) => {
      const nextPatch = typeof patch === "function" ? patch(prev) : patch;
      return { ...prev, ...nextPatch };
    });
  };

  /** Client validation for the current step. */
  const validateStep = (currentStep: number): boolean => {
    // Step 0: Only validate that at least one design is selected
    if (currentStep === 0) {
      if (state.designs.length === 0) {
        setErrors({ designs: "Please select at least one design to continue" });
        toast.error("Please select at least one design to continue");
        return false;
      }
      setErrors({});
      return true;
    }

    // Step 1: Validate that colors are picked for each selected design
    if (currentStep === 1) {
      const colorErrors: FieldErrors = {};
      state.designs.forEach((d, idx) => {
        if (!d.colors || d.colors.length === 0) {
          colorErrors[`designs.${idx}.colors`] = "Please pick at least one colour";
        }
      });
      if (Object.keys(colorErrors).length > 0) {
        setErrors(colorErrors);
        toast.error("Please pick at least one colour for each design");
        const el = document.querySelector("[data-error='true']");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      setErrors({});
      return true;
    }

    const payload = toPayload(state);
    const parsed = surveySchema.safeParse(payload);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const allErrors = toFieldErrors(parsed.error);
    const allowed = new Set<string>(STEP_FIELDS[currentStep] as string[]);
    const stepErrors: FieldErrors = {};
    for (const [k, msg] of Object.entries(allErrors)) {
      const root = k.split(".")[0];
      if (allowed.has(root)) stepErrors[k] = msg;
    }
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      const firstMsg = Object.values(stepErrors)[0];
      toast.error(firstMsg);
      // Scroll to the first error on the step.
      const el = document.querySelector("[data-error='true'], [aria-invalid='true']");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: document.getElementById("survey-flow")?.offsetTop ?? 0, behavior: "smooth" });
  };

  const prev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: document.getElementById("survey-flow")?.offsetTop ?? 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    try {
      const res = await submitSurvey(toPayload(state), honeypot);
      if (res.ok) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        toast.error(res.error);
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setState(initialSurveyState());
    setStep(0);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return <SurveySuccess onReset={reset} />;
  }

  const stepProps = { state, update, errors, designs };
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div id="survey-flow" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-14">
      {/* Progress header */}
      <div className="mb-8 space-y-4 sm:mb-12">
        <div className="flex items-center justify-between text-xs tracking-wider text-muted-foreground uppercase">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="font-serif text-sm font-semibold text-wine">
            {state.designs.length} {state.designs.length === 1 ? "design" : "designs"} chosen
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
          <div
            className="h-full bg-wine transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">
            {current.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{current.subtitle}</p>
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[380px]">
        {step === 0 && <StepDesigns {...stepProps} />}
        {step === 1 && <StepColors {...stepProps} />}
        {step === 2 && <StepFabricFit {...stepProps} />}
        {step === 3 && <StepCollection {...stepProps} />}
        {step === 4 && (
          <StepDetails {...stepProps} honeypot={honeypot} onHoneypotChange={setHoneypot} />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-border/70 pt-6 sm:flex-row">
        {step > 0 ? (
          <button
            type="button"
            onClick={prev}
            disabled={isSubmitting}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium transition hover:border-ink/40 sm:w-auto"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {isLast ? (
          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-wine px-8 text-base font-medium text-ivory shadow-[0_12px_28px_-10px_rgba(107,30,54,0.6)] transition hover:bg-wine-dark disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Submit My Preferences"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-wine px-8 text-base font-medium text-ivory shadow-[0_12px_28px_-10px_rgba(107,30,54,0.55)] transition hover:bg-wine-dark sm:w-auto"
          >
            Continue <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

