"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DIAL_CODES } from "@/lib/inquiry";
import { cn } from "@/lib/utils";
import {
  EASE_OUT,
  FieldError,
  INPUT,
  INVALID,
  LEGEND,
  Underline,
} from "./InquireFields";
import { useDismiss } from "./useDismiss";

/** Phone / WhatsApp with a searchable country code, for couples living abroad. */
export default function InquirePhone({ error }: { error?: string }) {
  const [country, setCountry] = useState<string>(DIAL_CODES[0][0]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, rootRef, close);

  const [, , dial] =
    DIAL_CODES.find(([code]) => code === country) ?? DIAL_CODES[0];
  const needle = query.trim().toLowerCase();
  const matches = DIAL_CODES.filter(
    ([code, name, prefix]) =>
      !needle ||
      name.toLowerCase().includes(needle) ||
      code.toLowerCase() === needle ||
      prefix.includes(needle.replace(/^\+?/, "+")),
  );

  useEffect(() => {
    if (open) searchRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onReset = () => setCountry(DIAL_CODES[0][0]);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  const choose = (code: string) => {
    setCountry(code);
    setOpen(false);
    rootRef.current
      ?.querySelector<HTMLInputElement>("input[type=tel]")
      ?.focus();
  };

  return (
    <div>
      <div ref={rootRef} className="relative pt-6">
        <span
          className={cn(LEGEND, "pointer-events-none absolute top-1 left-0")}
        >
          Phone / WhatsApp
        </span>
        <input type="hidden" name="phoneCode" value={dial} />
        <div className="flex items-end gap-4">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Country code ${dial}, change`}
            onClick={() => {
              setQuery("");
              setOpen(!open);
            }}
            className="flex shrink-0 cursor-pointer items-baseline gap-2 border-b border-ink/20 pt-2 pb-3 font-logo text-lg font-bold tracking-[-0.01em] text-ink transition-colors hover:border-ink md:text-xl"
          >
            <span className="font-logo-sub text-[0.625rem] tracking-[0.14em] text-ink/45">
              {country}
            </span>
            {dial}
            <svg
              aria-hidden="true"
              viewBox="0 0 10 6"
              className={cn(
                "w-2.5 self-center text-ink/50 transition-transform duration-500",
                open && "rotate-180",
                EASE_OUT,
              )}
            >
              <path
                d="M1 1l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </button>
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Phone number</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel-national"
              inputMode="tel"
              aria-invalid={Boolean(error)}
              aria-describedby="phone-error"
              className={cn(INPUT, INVALID, "pt-2")}
            />
            <Underline />
          </label>
        </div>

        <div
          data-open={open ? "" : undefined}
          inert={!open}
          className={cn(
            "absolute top-full left-0 z-20 mt-3 w-[18.5rem] -translate-y-2 rounded-[1.25rem] border border-ink/10 bg-paper p-3 text-ink opacity-0 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] transition-[opacity,translate] duration-500 data-open:translate-y-0 data-open:opacity-100",
            EASE_OUT,
          )}
        >
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (matches[0]) choose(matches[0][0]);
              }
            }}
            placeholder="Search country or code"
            aria-label="Search country or code"
            className="w-full rounded-full border border-ink/15 bg-transparent px-4 py-2.5 font-logo-sub text-xs tracking-[0.08em] uppercase outline-none placeholder:text-ink/35 focus:border-ink/50"
          />
          <ul
            role="listbox"
            aria-label="Country code"
            data-lenis-prevent
            className="mt-2 max-h-64 overflow-y-auto overscroll-contain"
          >
            {matches.map(([code, name, prefix]) => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={code === country}
                  onClick={() => choose(code)}
                  className={cn(
                    "flex w-full cursor-pointer items-baseline gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ink/6",
                    code === country && "bg-ink text-canvas hover:bg-ink",
                  )}
                >
                  <span
                    className={cn(
                      "w-6 font-logo-sub text-[0.625rem] tracking-[0.14em]",
                      code === country ? "text-canvas/60" : "text-ink/40",
                    )}
                  >
                    {code}
                  </span>
                  <span className="flex-1 font-logo text-sm font-bold">
                    {name}
                  </span>
                  <span className="font-logo text-sm tabular-nums opacity-70">
                    {prefix}
                  </span>
                </button>
              </li>
            ))}
            {matches.length === 0 && (
              <li className="px-3 py-4 font-logo-sub text-xs tracking-[0.08em] text-ink/45 uppercase">
                No match
              </li>
            )}
          </ul>
        </div>
      </div>
      <FieldError id="phone-error" error={error} />
    </div>
  );
}
