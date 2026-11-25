"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  coverPool,
  galleryHref,
  shuffleCoverFrames,
  type CoverFrame,
  type Gallery,
} from "@/lib/constants";
import { useLenis } from "@/lib/lenis";
import { useIdleAutoScroll } from "@/lib/useIdleAutoScroll";
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

/** How long each still holds before the next frame fades in. */
const HOLD_MS = 7500;
/** Clips hold longer so the motion has time to land before the next frame. */
const VIDEO_HOLD_MS = 12000;
/** Extra wait before a tile's first turn, so neighbouring tiles never change together. */
const STAGGER_MS = 900;

const frameClass = (active: boolean, previous: boolean) =>
  cn(
    "absolute inset-0 size-full object-cover",
    active
      ? "z-[2] scale-100 opacity-100 transition-[opacity,scale] duration-[1100ms,2400ms] ease-[cubic-bezier(0.33,1,0.68,1)]"
      : previous
        ? "z-[1] opacity-100"
        : "z-0 scale-[1.06] opacity-0",
  );

/**
 * Up to four still covers, plus any clips, shuffled into a fresh order on every page load.
 * Videos are optional — just another frame in the mix when a couple has them.
 */
function TileMedia({ gallery, index }: { gallery: Gallery; index: number }) {
  const pool = useMemo(() => coverPool(gallery), [gallery]);
  // Stable first paint (still cover); shuffled once the browser takes over.
  const [frames, setFrames] = useState<readonly CoverFrame[]>(() =>
    pool.filter((frame) => frame.kind === "image").slice(0, 1),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [turn, setTurn] = useState({ shown: 0, previous: -1, reach: 0 });
  const loaded = useRef(new Set<number>());
  const firstRow = index < COLUMNS;
  const eager = index < COLUMNS * EAGER_ROWS;

  useEffect(() => {
    loaded.current = new Set();
    let ordered = pool.length < 2 ? [...pool] : shuffleCoverFrames(pool);
    // Keep the painted cover as frame 0 so the intro rise never remounts mid-animation.
    if (ordered.length > 1) {
      const coverIndex = ordered.findIndex(
        (frame) => frame.kind === "image" && frame.src === gallery.cover,
      );
      if (coverIndex > 0) {
        const [cover] = ordered.splice(coverIndex, 1);
        ordered = [cover, ...ordered];
      }
    }
    const id = window.setTimeout(() => {
      setFrames(ordered);
      setTurn({ shown: 0, previous: -1, reach: 0 });
    }, 0);
    return () => window.clearTimeout(id);
  }, [gallery.cover, gallery.slug, pool]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || frames.length < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let onScreen = false;
    let started = false;
    let timer = 0;
    let shown = 0;
    let reach = 0;
    const holdFor = () =>
      frames[shown].kind === "video" ? VIDEO_HOLD_MS : HOLD_MS;

    /** Moves to the next frame if it has arrived (never fades in a blank); says whether it did. */
    const advance = () => {
      const next = (shown + 1) % frames.length;
      if (!loaded.current.has(next)) return false;
      reach = Math.max(reach, next);
      setTurn({ shown: next, previous: shown, reach });
      shown = next;
      return true;
    };

    const tick = () => {
      if (!onScreen) return;
      if (document.hidden || !advance()) {
        timer = window.setTimeout(tick, 700);
        return;
      }
      timer = window.setTimeout(tick, holdFor());
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasOnScreen = onScreen;
      onScreen = entry.isIntersecting;
      if (onScreen === wasOnScreen) return;
      window.clearTimeout(timer);
      if (onScreen) {
        // Back in view: hold this frame its full time. The very first turn is staggered
        // so neighbouring tiles never change together.
        const wait = started
          ? holdFor()
          : HOLD_MS +
            ((index % COLUMNS) + Math.floor(index / COLUMNS)) * STAGGER_MS;
        started = true;
        timer = window.setTimeout(tick, wait);
      } else {
        // Out of view: quietly turn to the next frame, so scrolling back shows something new.
        advance();
      }
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [frames, index]);

  // Play only the active clip; pause the rest so off-screen tiles stay quiet.
  useEffect(() => {
    videoRefs.current.forEach((video, frameIndex) => {
      if (frameIndex === turn.shown) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [turn.shown]);

  // Only the frames shown so far plus the next one are mounted, so media loads one at a time.
  const mounted = frames.slice(0, Math.min(frames.length, turn.reach + 2));

  return (
    <div ref={rootRef} className="absolute inset-0">
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
        {mounted.map((frame, i) => {
          const active = i === turn.shown;
          const previous = i === turn.previous;
          if (frame.kind === "video") {
            return (
              <video
                key={frame.src}
                ref={(node) => {
                  if (node) {
                    videoRefs.current.set(i, node);
                    // Cached clips skip onLoadedData, so mark them ready from the element itself.
                    if (node.readyState >= 2) loaded.current.add(i);
                  } else videoRefs.current.delete(i);
                }}
                src={frame.src}
                poster={gallery.cover}
                muted
                loop
                playsInline
                preload={i === 0 && eager ? "auto" : "metadata"}
                onLoadedData={() => loaded.current.add(i)}
                className={frameClass(active, previous)}
              />
            );
          }
          return (
            <Image
              key={frame.src}
              src={frame.src}
              alt={i === 0 ? gallery.title : ""}
              fill
              quality={90}
              sizes={SIZES}
              loading={i === 0 && eager ? "eager" : "lazy"}
              fetchPriority={i === 0 && firstRow ? "high" : "auto"}
              onLoad={() => loaded.current.add(i)}
              className={frameClass(active, previous)}
            />
          );
        })}
      </div>
    </div>
  );
}

function PortfolioTile({
  gallery,
  index,
}: {
  gallery: Gallery;
  index: number;
}) {
  const [ref, visible] = useReveal<HTMLAnchorElement>(0, "0px 0px 15% 0px");
  const delay = (index % COLUMNS) * 120;

  return (
    <Link
      ref={ref}
      href={galleryHref(gallery.slug)}
      aria-label={gallery.title}
      className="group relative -mr-px -mb-px block aspect-[3/4] overflow-hidden bg-canvas [content-visibility:auto]"
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
        <TileMedia gallery={gallery} index={index} />
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

/** This visit's couple order and grid/index choice; a full reload starts a fresh visit. */
let visitOrder: readonly string[] | null = null;
let visitView: PortfolioView = "grid";

/** Puts galleries in the remembered order; any couple added since goes at the end. */
function applyOrder(list: readonly Gallery[], order: readonly string[]) {
  const rank = new Map(order.map((slug, i) => [slug, i]));
  return [...list].sort(
    (a, b) =>
      (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
  );
}

/** Fresh random couple order for this page load. */
function shuffleGalleries(list: readonly Gallery[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function PortfolioGrid({
  galleries: initial,
}: {
  galleries: readonly Gallery[];
}) {
  // First load: CMS order for the first paint (matches SSR), shuffled once the browser takes over.
  // Coming back to the page in the same visit: the order the visitor already saw, so Back
  // lands on the same couples it left.
  const [galleries, setGalleries] = useState(() =>
    visitOrder ? applyOrder(initial, visitOrder) : initial,
  );
  const [view, setView] = useState<PortfolioView>(() => visitView);
  useEffect(() => {
    visitView = view;
  }, [view]);
  const [swapping, setSwapping] = useState(false);
  const swapTimer = useRef<number | undefined>(undefined);
  const lenis = useLenis();
  useIdleAutoScroll(view === "grid" && !swapping && galleries.length > 0);

  useEffect(() => {
    if (visitOrder || initial.length < 2) return;
    const id = window.setTimeout(() => {
      const shuffled = shuffleGalleries(initial);
      visitOrder = shuffled.map((gallery) => gallery.slug);
      setGalleries(shuffled);
    }, 0);
    return () => window.clearTimeout(id);
  }, [initial]);

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
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
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
      <PortfolioMenu
        galleries={galleries}
        view={view}
        onToggleView={() =>
          swap(() =>
            setView((current) => (current === "grid" ? "index" : "grid")),
          )
        }
      />
    </section>
  );
}
