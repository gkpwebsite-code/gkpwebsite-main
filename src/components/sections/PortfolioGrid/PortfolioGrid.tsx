"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GALLERIES, galleryHref, type Gallery } from "@/lib/constants";
import { EASE } from "@/lib/theme";
import { useReveal } from "@/lib/useReveal";
import CategoryFilter, { type CategoryFilterValue } from "./CategoryFilter";

const COLUMNS = 3;
/** Deliberately larger than each tile's rendered width so the browser fetches oversampled, sharper copies. */
const SIZES = "(min-width: 1024px) 50vw, 100vw";
const SWAP_MS = 450;

function PortfolioTile({
  gallery,
  index,
}: {
  gallery: Gallery;
  index: number;
}) {
  const [ref, visible] = useReveal<HTMLAnchorElement>(0.1);
  const aboveFold = index < COLUMNS;
  const delay = (index % COLUMNS) * 120;

  return (
    <Link
      ref={ref}
      href={galleryHref(gallery.slug)}
      aria-label={gallery.title}
      className="group relative block aspect-[3/4] overflow-hidden bg-mist"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 1.2s ${EASE} ${delay}ms`,
      }}
    >
      <Image
        src={gallery.cover}
        alt={gallery.title}
        fill
        quality={90}
        sizes={SIZES}
        loading={aboveFold ? "eager" : "lazy"}
        fetchPriority={aboveFold ? "high" : "auto"}
        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <p
        aria-hidden="true"
        className="absolute right-5 bottom-5 -mr-[0.15em] translate-y-2 text-right font-caption text-xs leading-none font-normal tracking-[0.15em] text-paper uppercase opacity-0 mix-blend-difference transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-[opacity,translate] group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100 group-hover:duration-700 group-hover:ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:right-6 md:bottom-6 md:text-sm"
      >
        {gallery.title}
      </p>
    </Link>
  );
}

export default function PortfolioGrid() {
  const [filter, setFilter] = useState<CategoryFilterValue>("all");
  const [shown, setShown] = useState<CategoryFilterValue>("all");
  const swapTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(swapTimer.current), []);

  const changeFilter = (next: CategoryFilterValue) => {
    if (next === filter) return;
    setFilter(next);
    window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => {
      setShown(next);
      window.scrollTo({ top: 0 });
    }, SWAP_MS);
  };

  const galleries =
    shown === "all"
      ? GALLERIES
      : GALLERIES.filter((gallery) => gallery.categories.includes(shown));
  const swapping = filter !== shown;

  return (
    <section className="bg-canvas">
      <h1 className="sr-only">Portfolio</h1>
      <div
        className="transition-opacity ease-in-out"
        style={{
          opacity: swapping ? 0 : 1,
          transitionDuration: `${SWAP_MS}ms`,
        }}
      >
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery, index) => (
              <PortfolioTile
                key={gallery.slug}
                gallery={gallery}
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="flex min-h-svh items-center justify-center font-logo-sub text-xs tracking-[0.15em] text-muted uppercase md:text-sm">
            Stories coming soon
          </p>
        )}
      </div>
      <CategoryFilter value={filter} onChange={changeFilter} />
    </section>
  );
}
