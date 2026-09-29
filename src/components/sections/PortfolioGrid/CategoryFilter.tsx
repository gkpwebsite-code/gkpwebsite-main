"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type CategoryFilterValue = CategoryId | "all";

const OPTIONS: readonly { id: CategoryFilterValue; label: string }[] = [
  { id: "all", label: "All" },
  ...CATEGORIES,
];

export default function CategoryFilter({
  value,
  onChange,
}: {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-0 left-0 z-50 flex flex-col items-start pb-8 pl-6 text-paper mix-blend-difference md:pb-12 md:pl-9"
    >
      <ul
        id={listId}
        aria-label="Filter by category"
        className={cn(
          "mb-4 flex flex-col gap-2.5",
          open && "pointer-events-auto",
        )}
      >
        {OPTIONS.map((option, index) => {
          const active = option.id === value;
          const order = OPTIONS.length - 1 - index;
          return (
            <li
              key={option.id}
              className={cn(
                "transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
              style={{ transitionDelay: `${(open ? order : index) * 40}ms` }}
            >
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                aria-pressed={active}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className="group flex items-center gap-3 font-logo-sub text-xs leading-none tracking-[0.15em] uppercase md:text-sm"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px bg-current transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active ? "w-6" : "w-0 group-hover:w-3",
                  )}
                />
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        aria-label={open ? "Close category filter" : "Open category filter"}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className="pointer-events-auto font-logo text-[9rem] font-bold md:text-[12rem] lg:text-[15rem]"
      >
        {/* Box sized to the Forma Micro Bold asterisk outline (0.337em tall, top-aligned at leading 0.9) so it sits flush and rotates about its own centre. */}
        <span
          aria-hidden="true"
          className={cn(
            "block h-[0.337em] w-[0.352em] origin-[0.171em_0.169em] leading-[0.9] transition-[rotate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open && "rotate-90",
          )}
        >
          *
        </span>
      </button>
    </div>
  );
}
