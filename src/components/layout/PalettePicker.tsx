"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import {
  PALETTES,
  PALETTE_STORAGE_KEY,
  applyPalette,
  type Palette,
} from "@/lib/palettes";
import { cn } from "@/lib/utils";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readChoice() {
  return localStorage.getItem(PALETTE_STORAGE_KEY) ?? PALETTES[0].id;
}

function choose(id: string) {
  localStorage.setItem(PALETTE_STORAGE_KEY, id);
  listeners.forEach((listener) => listener());
}

function swatchStyle(palette: Palette) {
  return {
    background: `linear-gradient(135deg, ${palette.bg} 50%, ${palette.accent} 50%)`,
  };
}

/** Swatch row for comparing menu palettes; folded behind a toggle on phones. */
export default function PalettePicker({ tabIndex }: { tabIndex: number }) {
  const [expanded, setExpanded] = useState(false);
  const swatchesId = useId();
  const activeId = useSyncExternalStore(
    subscribe,
    readChoice,
    () => PALETTES[0].id,
  );
  const active =
    PALETTES.find((palette) => palette.id === activeId) ?? PALETTES[0];

  useEffect(() => {
    applyPalette(active);
  }, [active]);

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <button
        type="button"
        tabIndex={tabIndex}
        aria-expanded={expanded}
        aria-controls={swatchesId}
        onClick={() => setExpanded((current) => !current)}
        className="flex cursor-pointer items-center gap-2 font-logo-sub text-[0.625rem] leading-none tracking-[0.12em] text-menu-text/60 uppercase md:hidden"
      >
        <span
          aria-hidden="true"
          className="size-3.5 rounded-full border border-menu-text/30"
          style={swatchStyle(active)}
        />
        {active.name}
        <span
          aria-hidden="true"
          className={cn(
            "transition-transform duration-300",
            expanded && "rotate-180",
          )}
        >
          &#9662;
        </span>
      </button>
      <p className="hidden font-logo-sub text-xs leading-none tracking-[0.12em] text-menu-text/60 uppercase md:block">
        {active.name}
      </p>
      <div
        id={swatchesId}
        role="radiogroup"
        aria-label="Menu colour"
        className={cn(
          "max-w-[13rem] flex-wrap gap-2 md:flex md:max-w-none md:justify-end",
          expanded ? "flex" : "hidden",
        )}
      >
        {PALETTES.map((palette) => (
          <button
            key={palette.id}
            type="button"
            role="radio"
            aria-checked={palette.id === active.id}
            aria-label={palette.name}
            title={palette.name}
            tabIndex={tabIndex}
            onClick={() => choose(palette.id)}
            className={cn(
              "size-5 cursor-pointer rounded-full border border-menu-text/30 transition-transform hover:scale-110 md:size-6",
              palette.id === active.id &&
                "ring-1 ring-menu-text ring-offset-2 ring-offset-menu-bg",
            )}
            style={swatchStyle(palette)}
          />
        ))}
      </div>
    </div>
  );
}
