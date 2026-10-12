"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  FOOTER_PALETTES,
  FOOTER_PALETTE_STORAGE_KEY,
  applyFooterPalette,
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
  return (
    localStorage.getItem(FOOTER_PALETTE_STORAGE_KEY) ?? FOOTER_PALETTES[0].id
  );
}

function choose(id: string) {
  localStorage.setItem(FOOTER_PALETTE_STORAGE_KEY, id);
  listeners.forEach((listener) => listener());
}

/**
 * Floating column of swatches in the right-hand gutter for comparing footer colours; it only
 * appears while the footer is on screen.
 */
export default function FooterPalettePicker({ visible }: { visible: boolean }) {
  const activeId = useSyncExternalStore(
    subscribe,
    readChoice,
    () => FOOTER_PALETTES[0].id,
  );
  const active =
    FOOTER_PALETTES.find((palette) => palette.id === activeId) ??
    FOOTER_PALETTES[0];

  useEffect(() => {
    applyFooterPalette(active);
  }, [active]);

  return (
    <div
      role="radiogroup"
      aria-label="Footer colour"
      inert={!visible}
      data-visible={visible ? "" : undefined}
      className="pointer-events-none fixed top-1/2 right-2.5 z-30 flex -translate-y-1/2 flex-col items-center gap-2 opacity-0 transition-opacity duration-500 data-visible:pointer-events-auto data-visible:opacity-100 md:right-7 md:gap-2.5"
    >
      {FOOTER_PALETTES.map((palette) => (
        <button
          key={palette.id}
          type="button"
          role="radio"
          aria-checked={palette.id === active.id}
          aria-label={palette.name}
          title={palette.name}
          onClick={() => choose(palette.id)}
          className={cn(
            "size-5 cursor-pointer rounded-full border border-footer-text/25 transition-transform hover:scale-110 md:size-6",
            palette.id === active.id &&
              "ring-1 ring-footer-text ring-offset-2 ring-offset-footer-bg",
          )}
          style={{
            background: `linear-gradient(135deg, ${palette.bg} 50%, ${palette.text} 50%)`,
          }}
        />
      ))}
    </div>
  );
}
