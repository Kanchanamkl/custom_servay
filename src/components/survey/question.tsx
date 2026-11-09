import { cn } from "@/lib/utils";

type QuestionProps = {
  id: string;
  title: React.ReactNode;
  hint?: React.ReactNode;
  optional?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

/** A titled survey question block with optional badge and error message. */
export function Question({ id, title, hint, optional, error, className, children }: QuestionProps) {
  return (
    <section aria-labelledby={`${id}-title`} className={cn("space-y-4", className)} data-error={error ? "true" : undefined}>
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id={`${id}-title`} className="text-2xl leading-tight font-medium text-ink sm:text-[1.7rem]">
            {title}
          </h3>
          {optional && (
            <span className="rounded-full bg-sand/70 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-[0.15em] text-muted-foreground uppercase">
              Optional
            </span>
          )}
        </div>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}

