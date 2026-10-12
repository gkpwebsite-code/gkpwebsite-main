"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDismiss } from "./useDismiss";

const EASE_OUT = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const SMALL_CAPS =
  "font-logo-sub text-[0.6875rem] leading-none tracking-[0.14em] uppercase md:text-xs";

/** Dates travel as local `YYYY-MM-DD` keys so comparisons are plain string compares. */
const toKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const fromKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const SHORT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const LONG = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const MONTH = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

/** Monday-first weeks for the month containing `view`, padded with nulls. */
function monthCells(view: Date) {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from(
      { length: days },
      (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1),
    ),
  ];
}

type DateFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (key: string) => void;
  min: string;
  range: [string, string];
  align: "left" | "right";
};

function DateField({
  name,
  label,
  value,
  onChange,
  min,
  range,
  align,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => fromKey(value || min));
  const rootRef = useRef<HTMLDivElement>(null);
  const todayKey = toKey(new Date());

  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, rootRef, close);

  const toggle = () => {
    if (!open) setView(fromKey(value || min));
    setOpen(!open);
  };
  const shiftMonth = (by: number) =>
    setView(new Date(view.getFullYear(), view.getMonth() + by, 1));
  const minMonth = fromKey(min);
  const atFirstMonth =
    view.getFullYear() === minMonth.getFullYear() &&
    view.getMonth() === minMonth.getMonth();

  return (
    <div ref={rootRef} className="relative pt-6">
      <input
        type="hidden"
        name={name}
        value={value ? LONG.format(fromKey(value)) : ""}
      />
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className="peer block w-full cursor-pointer border-b border-ink/20 pt-2 pb-3 text-left font-logo text-base font-bold tracking-[-0.01em] text-ink outline-none md:text-lg"
      >
        <span className={cn(!value && "text-ink/25")}>
          {value ? SHORT.format(fromKey(value)) : "Select date"}
        </span>
      </button>
      <span
        className={cn(
          SMALL_CAPS,
          "pointer-events-none absolute top-1 left-0 text-ink/60",
        )}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-[calc(100%-1px)] h-px origin-left bg-ink transition-[scale] duration-700 peer-focus-visible:scale-x-100",
          open ? "scale-x-100" : "scale-x-0",
          EASE_OUT,
        )}
      />

      <div
        role="dialog"
        aria-label={`Choose ${label.toLowerCase()} date`}
        inert={!open}
        data-open={open ? "" : undefined}
        className={cn(
          "absolute top-full z-20 mt-3 w-[18.5rem] origin-top -translate-y-2 rounded-[1.25rem] border border-ink/10 bg-paper p-5 text-ink opacity-0 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] transition-[opacity,translate] duration-500 data-open:translate-y-0 data-open:opacity-100",
          align === "left" ? "left-0" : "right-0",
          EASE_OUT,
        )}
      >
        <div className="flex items-center justify-between">
          <p className="font-logo text-base leading-none font-bold tracking-[-0.01em] uppercase">
            {MONTH.format(view)}
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Previous month"
              disabled={atFirstMonth}
              onClick={() => shiftMonth(-1)}
              className="grid size-8 cursor-pointer place-items-center rounded-full transition-colors hover:bg-ink/8 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent"
            >
              &larr;
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
              className="grid size-8 cursor-pointer place-items-center rounded-full transition-colors hover:bg-ink/8"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((day, i) => (
            <span key={i} className={cn(SMALL_CAPS, "pb-2 text-ink/40")}>
              {day}
            </span>
          ))}
          {monthCells(view).map((date, i) => {
            if (!date) return <span key={i} />;
            const key = toKey(date);
            const selected = key === value;
            const between =
              range[0] && range[1] && key > range[0] && key < range[1];
            const disabled = key < min;
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-label={LONG.format(date)}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={cn(
                  "relative mx-auto grid size-9 cursor-pointer place-items-center rounded-full font-logo text-sm leading-none font-bold tabular-nums transition-colors",
                  selected
                    ? "bg-ink text-canvas"
                    : between
                      ? "bg-ink/8 hover:bg-ink/15"
                      : "hover:bg-ink/8",
                  disabled && "cursor-default text-ink/20 hover:bg-transparent",
                )}
              >
                {date.getDate()}
                {key === todayKey && !selected && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-ink/50" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between border-t border-ink/10 pt-4">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={cn(
              SMALL_CAPS,
              "cursor-pointer text-ink/50 transition-colors hover:text-ink",
            )}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cn(
              SMALL_CAPS,
              "cursor-pointer text-ink/50 transition-colors hover:text-ink",
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/** From / To wedding dates in the site's own calendar; past days and a To before From are off. */
export default function InquireDates() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [undecided, setUndecided] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const today = toKey(new Date());

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onReset = () => {
      setFrom("");
      setTo("");
      setUndecided(false);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  return (
    <div ref={rootRef}>
      <div
        className={cn(
          "grid grid-cols-2 gap-x-6 transition-opacity duration-500",
          undecided && "pointer-events-none opacity-30",
        )}
        inert={undecided}
      >
        <DateField
          name="dateFrom"
          label="From"
          value={from}
          min={today}
          range={[from, to]}
          align="left"
          onChange={(key) => {
            setFrom(key);
            if (key && to && to < key) setTo("");
          }}
        />
        <DateField
          name="dateTo"
          label="To"
          value={to}
          min={from || today}
          range={[from, to]}
          align="right"
          onChange={setTo}
        />
      </div>
      <label className="mt-5 inline-flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="datesUndecided"
          checked={undecided}
          onChange={(event) => {
            setUndecided(event.target.checked);
            if (event.target.checked) {
              setFrom("");
              setTo("");
            }
          }}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "relative h-[1.125rem] w-8 rounded-full border border-ink/30 transition-colors duration-500 peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
            "after:absolute after:top-[2px] after:left-[2px] after:size-3 after:rounded-full after:bg-ink/50 after:transition-[translate,background-color] after:duration-500 peer-checked:after:translate-x-[0.875rem] peer-checked:after:bg-canvas",
            EASE_OUT,
          )}
        />
        <span
          className={cn(
            SMALL_CAPS,
            "text-ink/50 transition-colors peer-checked:text-ink",
          )}
        >
          We&rsquo;re still deciding
        </span>
      </label>
    </div>
  );
}
