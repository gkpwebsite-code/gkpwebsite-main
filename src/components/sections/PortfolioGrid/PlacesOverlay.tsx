"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GALLERIES, galleryHref, type Gallery } from "@/lib/constants";
import { pauseScroll, resumeScroll } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { placeOf } from "./places";

/** Places in the order their first wedding appears in the portfolio. */
const PLACES = GALLERIES.reduce<{ place: string; couples: Gallery[] }[]>(
  (places, gallery) => {
    const place = placeOf(gallery);
    const existing = places.find((entry) => entry.place === place);
    if (existing) existing.couples.push(gallery);
    else places.push({ place, couples: [gallery] });
    return places;
  },
  [],
);

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

/** Full-screen list of the places Gautam has photographed; hovering a place brings its wedding up behind the words. */
export default function PlacesOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  // Covers only load once the overlay has been opened.
  const [primed, setPrimed] = useState(false);
  if (open && !primed) setPrimed(true);

  useEffect(() => {
    if (!open) return;
    pauseScroll();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      resumeScroll();
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Where we've been"
      inert={!open}
      className={cn(
        "fixed inset-0 z-[45] overflow-hidden bg-ink text-paper transition-[clip-path] duration-[1100ms]",
        open ? "[clip-path:inset(0)]" : "[clip-path:inset(100%_0_0_0)]",
        EASE,
      )}
    >
      {primed && (
        <div aria-hidden="true" className="absolute inset-0">
          {GALLERIES.map((gallery) => (
            <Image
              key={gallery.slug}
              src={gallery.cover}
              alt=""
              fill
              quality={90}
              sizes="100vw"
              className={cn(
                "object-cover brightness-[0.45] transition-[opacity,scale] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                active === gallery.slug
                  ? "scale-100 opacity-100"
                  : "scale-[1.06] opacity-0",
              )}
            />
          ))}
        </div>
      )}

      <div
        data-lenis-prevent
        className="relative h-full overflow-y-auto overscroll-contain px-3 pt-32 pr-12 pb-48 md:px-[5vw] md:pt-40 md:pr-28"
      >
        <p className="font-logo-sub text-[0.6875rem] leading-none tracking-[0.14em] text-paper/50 uppercase md:text-xs">
          Where we&rsquo;ve been &mdash; {PLACES.length} places
        </p>

        <ul
          className="group/list mt-10 md:mt-14"
          onMouseLeave={() => setActive(null)}
        >
          {PLACES.map(({ place, couples }, index) => (
            <li
              key={place}
              onMouseEnter={() => setActive(couples[0].slug)}
              className={cn(
                "border-t border-paper/15 py-4 transition-[opacity,translate] duration-700 md:py-5",
                "pointer-fine:group-has-[li:hover]/list:opacity-35 pointer-fine:hover:!opacity-100",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                "ease-[cubic-bezier(0.16,1,0.3,1)]",
              )}
              style={{
                transitionDelay: open ? `${300 + index * 45}ms` : "0ms",
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 md:gap-x-10">
                <span className="w-6 shrink-0 font-logo-sub text-[0.625rem] tracking-[0.14em] text-paper/40 md:w-8 md:text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link
                  href={galleryHref(couples[0].slug)}
                  onClick={onClose}
                  className="font-display text-[2.75rem] leading-[1] md:text-7xl lg:text-8xl"
                >
                  {place}
                </Link>
                <span className="flex basis-full flex-wrap gap-x-4 gap-y-1 pl-12 md:basis-auto md:pl-0">
                  {couples.map((couple) => (
                    <Link
                      key={couple.slug}
                      href={galleryHref(couple.slug)}
                      onClick={onClose}
                      onMouseEnter={() => setActive(couple.slug)}
                      className="font-logo-sub text-[0.6875rem] tracking-[0.14em] text-paper/60 uppercase transition-colors hover:text-paper md:text-xs"
                    >
                      {couple.title}
                    </Link>
                  ))}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
