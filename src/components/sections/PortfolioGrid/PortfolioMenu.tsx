"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { GALLERIES } from "@/lib/constants";
import { GK_MASK, GK_SIZE } from "@/lib/monogram";
import { cn } from "@/lib/utils";
import PlacesOverlay from "./PlacesOverlay";

/**
 * The GK monogram in the bottom-left corner: opens a short menu to browse the places Gautam
 * has photographed, or to shuffle the portfolio.
 */
export type PortfolioView = "grid" | "index";

const HAS_FILMS = GALLERIES.some((gallery) => gallery.clip);

export default function PortfolioMenu({
  view,
  films,
  onShuffle,
  onToggleView,
  onToggleFilms,
}: {
  view: PortfolioView;
  films: boolean;
  onShuffle: () => void;
  onToggleView: () => void;
  onToggleFilms: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [placesOpen, setPlacesOpen] = useState(false);
  const [spins, setSpins] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const closePlaces = useCallback(() => setPlacesOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const options = [
    {
      label: "Where we\u2019ve been",
      run: () => setPlacesOpen(true),
    },
    {
      label: view === "grid" ? "Index" : "Gallery",
      run: onToggleView,
    },
    // Films only appear once at least one couple has a clip.
    ...(HAS_FILMS
      ? [
          {
            label: films && view === "grid" ? "Photographs" : "Films",
            run: onToggleFilms,
          },
        ]
      : []),
    {
      label: "Surprise me",
      run: () => {
        setSpins((count) => count + 1);
        onShuffle();
      },
    },
  ];

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-ink/60 backdrop-blur-md transition-opacity duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <PlacesOverlay open={placesOpen} onClose={closePlaces} />
      <div
        ref={rootRef}
        data-category-filter
        className="pointer-events-none fixed bottom-0 left-0 z-50 flex flex-col items-start pb-8 pl-5 text-paper mix-blend-difference md:pb-12 md:pl-8"
      >
        <ul
          id={listId}
          aria-label="Explore the portfolio"
          className={cn(
            "mb-6 flex flex-col gap-4 md:mb-8 md:gap-5",
            menuOpen && "pointer-events-auto",
          )}
        >
          {options.map((option, index) => {
            const order = options.length - 1 - index;
            return (
              <li
                key={option.label}
                className={cn(
                  "transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0",
                )}
                style={{
                  transitionDelay: `${(menuOpen ? order : index) * 60}ms`,
                }}
              >
                <button
                  type="button"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => {
                    setMenuOpen(false);
                    option.run();
                  }}
                  className="group flex cursor-pointer items-center gap-4 font-logo-sub text-2xl leading-none tracking-[0.08em] uppercase md:text-4xl"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-current transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-5 md:h-0.5 md:group-hover:w-7"
                  />
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          aria-label={
            placesOpen
              ? "Close places"
              : menuOpen
                ? "Close portfolio menu"
                : "Open portfolio menu"
          }
          aria-expanded={menuOpen || placesOpen}
          aria-controls={listId}
          data-intro-from="bottom"
          onClick={() => {
            if (placesOpen) setPlacesOpen(false);
            else setMenuOpen((current) => !current);
          }}
          className="pointer-events-auto cursor-pointer"
        >
          <span
            aria-hidden="true"
            className={cn(
              "block bg-current transition-[rotate,scale] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
              GK_SIZE,
              GK_MASK,
              (menuOpen || placesOpen) && "scale-[0.82]",
            )}
            style={{ rotate: `${spins * 360}deg` }}
          />
        </button>
      </div>
    </>
  );
}
