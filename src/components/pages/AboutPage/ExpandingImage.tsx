"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import type { AboutFrame } from "@/lib/about";
import { fitClass, fitSizes } from "./frameFit";
import { useScrollProgress } from "./useScrollProgress";

export type ReelFrame = AboutFrame;

/** Zoom each photo settles from; kept small so photos stay at their sharpest. */
const FIRST_START_SCALE = 1.12;
const NEXT_START_SCALE = 1.06;

/** Screens of scrolling spent opening the first photograph. */
const OPEN = 1.1;
/** Share of each later frame's screen spent wiping in; the rest holds it still. */
const WIPE = 0.7;

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const easeOut = (value: number) => 1 - (1 - value) ** 3;

/**
 * Held in place while the page scrolls: the first photograph opens out from a small framed
 * window to fill the screen, then each following couple wipes up over the last.
 */
export default function ExpandingImage({
  frames,
}: {
  frames: readonly ReelFrame[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  const onProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const { top, height } = section.getBoundingClientRect();
    const screens =
      clamp(-top / (height - window.innerHeight)) * (OPEN + frames.length - 1);

    const open = easeOut(clamp(screens / OPEN));
    const first = frameRefs.current[0];
    if (first)
      first.style.clipPath = `inset(${(1 - open) * 22}% ${(1 - open) * 30}%)`;
    // Settles at true size, so the photo is never enlarged past its own resolution.
    const firstImage = imageRefs.current[0];
    if (firstImage)
      firstImage.style.scale = String(
        FIRST_START_SCALE - open * (FIRST_START_SCALE - 1),
      );

    let active = open > 0.75 ? 0 : -1;
    for (let index = 1; index < frames.length; index++) {
      const wipe = easeOut(clamp((screens - OPEN - (index - 1)) / WIPE));
      const frame = frameRefs.current[index];
      if (frame) frame.style.clipPath = `inset(${(1 - wipe) * 100}% 0 0 0)`;
      const image = imageRefs.current[index];
      if (image)
        image.style.scale = String(
          NEXT_START_SCALE - wipe * (NEXT_START_SCALE - 1),
        );
      if (wipe > 0.55) active = index;
    }

    if (counterRef.current) {
      counterRef.current.style.opacity = active < 0 ? "0" : "1";
      if (active >= 0)
        counterRef.current.textContent = `${String(active + 1).padStart(2, "0")} / ${String(frames.length).padStart(2, "0")}`;
    }
  }, [frames.length]);
  useScrollProgress(sectionRef, onProgress);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${(1 + OPEN + frames.length - 1) * 100}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {frames.map((frame, index) => (
          <div
            key={`${index}-${frame.src}`}
            ref={(element) => {
              frameRefs.current[index] = element;
            }}
            className="absolute inset-0 overflow-hidden bg-ink will-change-[clip-path]"
            style={{
              clipPath: index === 0 ? "inset(22% 30%)" : "inset(100% 0 0 0)",
            }}
          >
            <div
              ref={(element) => {
                imageRefs.current[index] = element;
              }}
              className="absolute inset-0 will-change-transform"
              style={{
                scale: String(
                  index === 0 ? FIRST_START_SCALE : NEXT_START_SCALE,
                ),
              }}
            >
              <Image
                src={frame.src}
                alt="A moment from one of our weddings"
                fill
                quality={90}
                sizes={fitSizes(frame)}
                className={fitClass(frame)}
                style={{ objectPosition: frame.position }}
              />
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/45 to-transparent" />
        {/* No couple names here: just the count, kept clear of the GK monogram in the corner. */}
        <div className="absolute inset-x-3 bottom-7 flex items-end justify-end gap-6 pr-9 text-white md:inset-x-[5vw] md:bottom-10 md:pr-20">
          <span
            ref={counterRef}
            className="font-logo-sub text-[0.6875rem] tracking-[0.14em] whitespace-nowrap opacity-0 transition-opacity duration-700 md:text-xs"
          />
        </div>
      </div>
    </section>
  );
}
