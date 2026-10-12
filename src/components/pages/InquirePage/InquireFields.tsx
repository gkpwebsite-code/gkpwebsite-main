import { cn } from "@/lib/utils";

export const EASE_OUT = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export const LEGEND =
  "font-logo-sub text-[0.6875rem] leading-none tracking-[0.14em] text-ink/45 uppercase md:text-xs";

const LABEL = cn(
  "pointer-events-none absolute top-8 left-0 origin-left font-logo-sub text-sm leading-none tracking-[0.12em] text-ink/45 uppercase transition-[translate,scale,color] duration-500",
  EASE_OUT,
);

export const INPUT =
  "peer block w-full rounded-none border-b border-ink/20 bg-transparent pb-3 font-logo text-lg font-bold tracking-[-0.01em] text-ink outline-none md:text-xl";

/** Draws in from the left while the field above it has focus. */
export function Underline() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ink transition-[scale] duration-700 peer-focus:scale-x-100",
        EASE_OUT,
      )}
    />
  );
}

/** The red underline and the message beneath a field that needs another look. */
export const INVALID = "aria-invalid:border-red-800/70";

export function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <p
      id={id}
      aria-live="polite"
      className={cn(
        "grid text-sm leading-snug text-red-800 transition-[grid-template-rows,opacity] duration-500",
        error ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        EASE_OUT,
      )}
    >
      <span className="overflow-hidden">
        <span className="block pt-2">{error}</span>
      </span>
    </p>
  );
}

type FieldProps = {
  name: string;
  label: string;
  type?: "text" | "email";
  required?: boolean;
  autoComplete?: string;
  className?: string;
  error?: string;
};

/** Underline-only input whose label floats up on focus, as on an engraved card. */
export function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  className,
  error,
}: FieldProps) {
  return (
    <div className={className}>
      <label className="relative block pt-6">
        <input
          name={name}
          type={type}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={`${name}-error`}
          autoComplete={autoComplete}
          placeholder=" "
          className={cn(INPUT, INVALID, "pt-2")}
        />
        <span
          className={cn(
            LABEL,
            "peer-focus:-translate-y-7 peer-focus:scale-[0.8] peer-focus:text-ink/60 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-[0.8]",
          )}
        >
          {label}
          {required && " *"}
        </span>
        <Underline />
      </label>
      <FieldError id={`${name}-error`} error={error} />
    </div>
  );
}

export function TextArea({ name, label }: { name: string; label: string }) {
  return (
    <label className="relative block pt-6">
      <textarea
        name={name}
        rows={4}
        placeholder=" "
        data-lenis-prevent
        className={cn(
          INPUT,
          "[field-sizing:content] min-h-32 resize-none pt-2 leading-snug",
        )}
      />
      <span
        className={cn(
          LABEL,
          "peer-focus:-translate-y-7 peer-focus:scale-[0.8] peer-focus:text-ink/60 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-[0.8]",
        )}
      >
        {label}
      </span>
      <Underline />
    </label>
  );
}

type PillsProps = {
  name: string;
  legend: string;
  options: readonly string[];
  multiple?: boolean;
};

/** Tappable choices; a selected pill fills with ink from the bottom. */
export function Pills({ name, legend, options, multiple }: PillsProps) {
  return (
    <fieldset>
      <legend className={LEGEND}>
        {legend}
        {multiple && (
          <span className="ml-2 tracking-[0.08em] normal-case">
            (choose all that apply)
          </span>
        )}
      </legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="relative isolate cursor-pointer overflow-hidden rounded-full border border-ink/20 px-4 py-2.5 font-logo text-sm leading-none font-bold tracking-[-0.005em] text-ink transition-[color,border-color] duration-500 hover:border-ink has-checked:border-ink has-checked:text-canvas has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink md:text-[0.9375rem]"
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-[scale] duration-500 peer-checked:scale-y-100",
                EASE_OUT,
              )}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
