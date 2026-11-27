"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Gallery } from "@/lib/constants";
import { pauseScroll, resumeScroll } from "@/lib/lenis";

/** How long each print stays on top before the next lands on it. */
const FLIP_MS = 200;
/** The stack waits this long at most for the first prints to arrive before flipping anyway. */
const MAX_WAIT_MS = 1500;
/** The cover's glide from the middle of the screen into its place on the page. */
const GROW_MS = 950;
/** Prints shown before the cover. */
const TEASERS = 4;
/** Same `sizes` as the page's own cover, so the final print *is* the cover the page shows. */
export const COVER_SIZES = "(min-width: 768px) 75vw, 150vw";
const PRINT_SIZES = "(min-width: 768px) 30vw, 70vw";
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

/** A few of the couple's strongest portrait stills, then the cover. */
function pickPrints(gallery: Gallery) {
  const portraits = gallery.images
    .filter(({ width, height }) => height > width)
    .map(({ src }) => src);
  const teasers = [...(gallery.covers ?? []), ...portraits]
    .filter(
      (src, index, list) =>
        src !== gallery.cover && list.indexOf(src) === index,
    )
    .slice(0, TEASERS);
  return [...teasers, gallery.cover];
}

/** A small, fixed tilt per print, like photographs dropped onto a stack. */
const TILTS = [-3, 2.5, -1.5, 3, 0];

/**
 * Opening for a gallery visited directly (opened from a link or reloaded): on white, the
 * couple's photographs flip by like a stack of prints, the cover lands last, then grows from the
 * middle into its place on the page while the names rise in beside it (`onReveal`). On phones,
 * where the cover sits below the names, the stack fades away instead.
 */
export default function GalleryFlipIntro({
  gallery,
  onReveal,
  onDone,
}: {
  gallery: Gallery;
  /** Start the page's own entrance (names rising, side labels sliding in). */
  onReveal: () => void;
  /** Remove the opening. */
  onDone: () => void;
}) {
  const [prints] = useState(() => pickPrints(gallery));
  const [shown, setShown] = useState(-1);
  const loaded = useRef(new Set<number>());
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReveal, onDone });
  useEffect(() => {
    callbacks.current = { onReveal, onDone };
  });

  useEffect(() => {
    pauseScroll();
    let timer = 0;
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });

    const run = async () => {
      // Hold on white until the first print and the cover have arrived (or give up waiting).
      const started = performance.now();
      while (
        !cancelled &&
        performance.now() - started < MAX_WAIT_MS &&
        !(loaded.current.has(0) && loaded.current.has(prints.length - 1))
      ) {
        await wait(50);
      }
      // Flip through the stack; a print that hasn't arrived yet is simply skipped.
      for (let index = 0; index < prints.length && !cancelled; index++) {
        const last = index === prints.length - 1;
        if (!last && !loaded.current.has(index)) continue;
        setShown(index);
        await wait(last ? FLIP_MS * 1.5 : FLIP_MS);
      }
      if (cancelled) return;

      const overlay = overlayRef.current;
      const frame = frameRef.current;
      const target = document
        .querySelector("[data-gallery-cover]")
        ?.getBoundingClientRect();
      callbacks.current.onReveal();

      if (overlay && frame && target && target.top < window.innerHeight) {
        // Desktop: the cover glides and grows from the middle into its own place on the page.
        // Measured while straight, then pinned by its corner: the centring shift comes off so
        // left/top/width/height alone carry it onto the cover's spot.
        frame.style.rotate = "0deg";
        const from = frame.getBoundingClientRect();
        frame.style.translate = "none";
        const grow = frame.animate(
          [
            {
              left: `${from.left}px`,
              top: `${from.top}px`,
              width: `${from.width}px`,
              height: `${from.height}px`,
            },
            {
              left: `${target.left}px`,
              top: `${target.top}px`,
              width: `${target.width}px`,
              height: `${target.height}px`,
            },
          ],
          { duration: GROW_MS, easing: EASE, fill: "forwards" },
        );
        overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: GROW_MS * 0.7,
          easing: "ease-out",
          fill: "forwards",
        });
        await grow.finished.catch(() => {});
      } else if (frame) {
        // Phones: the stack lifts away to reveal the names.
        await frame
          .animate(
            [
              { opacity: 1, scale: 1 },
              { opacity: 0, scale: 1.06 },
            ],
            { duration: 600, easing: "ease-out", fill: "forwards" },
          )
          .finished.catch(() => {});
        overlay
          ?.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 300,
            fill: "forwards",
          })
          .finished.catch(() => {});
        await wait(300);
      }
      if (!cancelled) callbacks.current.onDone();
    };
    void run();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      resumeScroll();
    };
  }, [prints]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[55]"
    >
      <div ref={overlayRef} className="absolute inset-0 bg-canvas" />
      {/* Fixed-position print, sized like a photograph held at arm's length. */}
      <div
        ref={frameRef}
        className="fixed top-1/2 left-1/2 h-[52svh] w-[min(70vw,39svh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{ rotate: `${TILTS[Math.max(shown, 0) % TILTS.length]}deg` }}
      >
        {prints.map((src, index) => {
          const cover = index === prints.length - 1;
          return (
            <Image
              key={`${index}-${src}`}
              src={src}
              alt=""
              fill
              loading="eager"
              fetchPriority={index === 0 || cover ? "high" : "auto"}
              quality={90}
              sizes={cover ? COVER_SIZES : PRINT_SIZES}
              onLoad={() => loaded.current.add(index)}
              className="object-cover"
              style={{
                opacity: index === shown ? 1 : 0,
                zIndex: index === shown ? 2 : 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
