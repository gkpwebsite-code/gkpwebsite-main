"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "./useScrollProgress";

export type ReelFrame = {
  src: string;
  caption: string;
  href: string;
  /** Where to anchor the crop, so faces survive on wide screens. */
  position?: string;
};

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
  const captionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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
    // Never settles below 1.06: some exports carry a thin printed border at the edges.
    const firstImage = imageRefs.current[0];
    if (firstImage) firstImage.style.scale = String(1.3 - open * 0.24);

    let active = open > 0.75 ? 0 : -1;
    for (let index = 1; index < frames.length; index++) {
      const wipe = easeOut(clamp((screens - OPEN - (index - 1)) / WIPE));
      const frame = frameRefs.current[index];
      if (frame) frame.style.clipPath = `inset(${(1 - wipe) * 100}% 0 0 0)`;
      const image = imageRefs.current[index];
      if (image) image.style.scale = String(1.18 - wipe * 0.12);
      if (wipe > 0.55) active = index;
    }

    captionRefs.current.forEach((caption, index) => {
      if (!caption) return;
      const shown = index === active;
      caption.style.opacity = shown ? "1" : "0";
      caption.style.translate = shown ? "0 0" : "0 0.75rem";
      caption.style.pointerEvents = shown ? "auto" : "none";
    });
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
            key={frame.src}
            ref={(element) => {
              frameRefs.current[index] = element;
            }}
            className="absolute inset-0 overflow-hidden bg-mist will-change-[clip-path]"
            style={{
              clipPath: index === 0 ? "inset(22% 30%)" : "inset(100% 0 0 0)",
            }}
          >
            <div
              ref={(element) => {
                imageRefs.current[index] = element;
              }}
              className="absolute inset-0 will-change-transform"
              style={{ scale: index === 0 ? "1.3" : "1.18" }}
            >
              <Image
                src={frame.src}
                alt={frame.caption}
                fill
                quality={90}
                sizes="(orientation: portrait) 180vh, 130vw"
                className="object-cover"
                style={{ objectPosition: frame.position }}
              />
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/45 to-transparent" />
        {/* Left padding keeps the captions clear of the GK monogram in the corner. */}
        <div className="absolute inset-x-3 bottom-7 flex items-end justify-between gap-6 pr-9 pl-20 text-white md:inset-x-[5vw] md:bottom-10 md:pr-20 md:pl-28 lg:pl-32">
          <div className="relative">
            {frames.map((frame, index) => (
              <Link
                key={frame.src}
                ref={(element) => {
                  captionRefs.current[index] = element;
                }}
                href={frame.href}
                className={cn(
                  "group flex items-baseline gap-4 opacity-0 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  index > 0 && "absolute bottom-0 left-0",
                )}
                style={{ translate: "0 0.75rem", pointerEvents: "none" }}
              >
                <span className="font-display text-3xl whitespace-nowrap italic md:text-5xl">
                  {frame.caption}
                </span>
                <span className="hidden font-logo-sub text-[0.6875rem] tracking-[0.14em] whitespace-nowrap uppercase opacity-80 transition-opacity group-hover:opacity-100 sm:inline md:text-xs">
                  View story &rarr;
                </span>
              </Link>
            ))}
          </div>
          <span
            ref={counterRef}
            className="font-logo-sub text-[0.6875rem] tracking-[0.14em] whitespace-nowrap opacity-0 transition-opacity duration-700 md:text-xs"
          />
        </div>
      </div>
    </section>
  );
}
