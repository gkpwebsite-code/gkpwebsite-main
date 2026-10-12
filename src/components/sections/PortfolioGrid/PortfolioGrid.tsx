"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  GALLERIES,
  coverFrames,
  galleryHref,
  type Gallery,
} from "@/lib/constants";
import { useLenis } from "@/lib/lenis";
import { EASE } from "@/lib/theme";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";
import PortfolioIndex from "./PortfolioIndex";
import PortfolioMenu, { type PortfolioView } from "./PortfolioMenu";

const COLUMNS = 3;
/** Rows loaded upfront; the second row already peeks into view on most laptop screens. */
const EAGER_ROWS = 2;
/** Deliberately larger than each tile's rendered width so the browser fetches oversampled, sharper copies. */
const SIZES = "(min-width: 1024px) 50vw, 100vw";
const SWAP_MS = 450;

/** How long each portrait holds before the next one fades in. */
const HOLD_MS = 3500;
/** Extra wait before a tile's first turn, so neighbouring tiles never change together. */
const STAGGER_MS = 900;

/**
 * The couple's cover, then their portraits, each fading in over the last while the tile is on
 * screen; in films mode their clip plays on top once it exists.
 */
function TileMedia({
  gallery,
  index,
  films,
}: {
  gallery: Gallery;
  index: number;
  films: boolean;
}) {
  const frames = coverFrames(gallery);
  const rootRef = useRef<HTMLDivElement>(null);
  const [turn, setTurn] = useState({ shown: 0, previous: -1, reach: 0 });
  const loaded = useRef(new Set<number>());
  const firstRow = index < COLUMNS;
  const eager = index < COLUMNS * EAGER_ROWS;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || frames.length < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let onScreen = false;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(root);
    let shown = 0;
    let reach = 0;
    const tick = () => {
      const next = (shown + 1) % frames.length;
      // Waits for the next portrait to arrive rather than fading in a blank.
      if (!onScreen || document.hidden || !loaded.current.has(next)) {
        timer = window.setTimeout(tick, 700);
        return;
      }
      reach = Math.max(reach, next);
      setTurn({ shown: next, previous: shown, reach });
      shown = next;
      timer = window.setTimeout(tick, HOLD_MS);
    };
    timer = window.setTimeout(
      tick,
      HOLD_MS + ((index % COLUMNS) + Math.floor(index / COLUMNS)) * STAGGER_MS,
    );
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [frames.length, index]);

  // Only the frames shown so far plus the next one are mounted, so portraits load one at a time.
  const mounted = frames.slice(0, Math.min(frames.length, turn.reach + 2));

  return (
    <div ref={rootRef} className="absolute inset-0">
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
        {mounted.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? gallery.title : ""}
            fill
            quality={90}
            sizes={SIZES}
            loading={i === 0 && eager ? "eager" : "lazy"}
            fetchPriority={i === 0 && firstRow ? "high" : "auto"}
            onLoad={() => loaded.current.add(i)}
            className={cn(
              "object-cover",
              i === turn.shown
                ? "z-[2] scale-100 opacity-100 transition-[opacity,scale] duration-[1100ms,2400ms] ease-[cubic-bezier(0.33,1,0.68,1)]"
                : i === turn.previous
                  ? "z-[1] opacity-100"
                  : "z-0 scale-[1.06] opacity-0",
            )}
          />
        ))}
      </div>
      {films && gallery.clip && (
        <video
          src={gallery.clip}
          poster={gallery.cover}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-[3] size-full object-cover"
        />
      )}
    </div>
  );
}

function PortfolioTile({
  gallery,
  index,
  films,
}: {
  gallery: Gallery;
  index: number;
  films: boolean;
}) {
  const [ref, visible] = useReveal<HTMLAnchorElement>(0, "0px 0px 15% 0px");
  const delay = (index % COLUMNS) * 120;

  return (
    <Link
      ref={ref}
      href={galleryHref(gallery.slug)}
      aria-label={gallery.title}
      className="group relative block aspect-[3/4] overflow-hidden bg-canvas [content-visibility:auto]"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 1.2s ${EASE} ${delay}ms`,
      }}
    >
      <div
        data-intro-rise
        className="absolute inset-0"
        style={{ "--i": index } as React.CSSProperties}
      >
        <TileMedia gallery={gallery} index={index} films={films} />
      </div>
      <p
        aria-hidden="true"
        className="absolute right-5 bottom-5 z-[4] -mr-[0.15em] translate-y-2 text-right font-caption text-xs leading-none font-normal tracking-[0.15em] text-paper uppercase opacity-0 mix-blend-difference transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-[opacity,translate] group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100 group-hover:duration-700 group-hover:ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:right-6 md:bottom-6 md:text-sm"
      >
        {gallery.title}
      </p>
    </Link>
  );
}

/** A fresh order that never matches the current one. */
function reshuffle(current: readonly Gallery[]) {
  const next = [...current];
  do {
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
  } while (next.length > 1 && next.every((g, i) => g === current[i]));
  return next;
}

export default function PortfolioGrid() {
  const [galleries, setGalleries] = useState<readonly Gallery[]>(GALLERIES);
  const [view, setView] = useState<PortfolioView>("grid");
  const [films, setFilms] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const swapTimer = useRef<number | undefined>(undefined);
  const lenis = useLenis();

  useEffect(() => () => window.clearTimeout(swapTimer.current), []);

  /** Fades the portfolio out, applies a change while it's hidden, and fades back in at the top. */
  const swap = (change: () => void) => {
    setSwapping(true);
    window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => {
      change();
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0 });
      setSwapping(false);
    }, SWAP_MS);
  };

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
        {view === "index" ? (
          <PortfolioIndex galleries={galleries} />
        ) : galleries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery, index) => (
              <PortfolioTile
                key={gallery.slug}
                gallery={gallery}
                index={index}
                films={films}
              />
            ))}
          </div>
        ) : (
          <p className="flex min-h-svh items-center justify-center font-logo-sub text-xs tracking-[0.15em] text-muted uppercase md:text-sm">
            Stories coming soon
          </p>
        )}
      </div>
      <PortfolioMenu
        view={view}
        films={films}
        onShuffle={() => swap(() => setGalleries(reshuffle))}
        onToggleView={() =>
          swap(() =>
            setView((current) => (current === "grid" ? "index" : "grid")),
          )
        }
        onToggleFilms={() => {
          if (view === "index") {
            swap(() => {
              setView("grid");
              setFilms(true);
            });
          } else setFilms((current) => !current);
        }}
      />
    </section>
  );
}
