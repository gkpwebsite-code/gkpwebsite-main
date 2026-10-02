"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GALLERIES, SITE_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PHOTO_COUNT = 6;
const HOLD_MS = 5000;

/**
 * Sized to the row: Forma Micro Bold "GAUTAM KHULLAR" is ~8.34em wide at -0.03em tracking, so the
 * font size is the free width over 8.4. The right padding clears CONTACT.
 */
const WORDMARK_SIZE =
  "pr-10 text-[calc((100vw-3.25rem)/8.4)] md:pr-20 md:text-[calc((100vw-6.25rem)/8.4)]";

function pickCovers() {
  const covers = GALLERIES.map((gallery) => gallery.cover);
  for (let index = covers.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [covers[index], covers[swap]] = [covers[swap], covers[index]];
  }
  return covers.slice(0, PHOTO_COUNT);
}

/**
 * The studio name as a window onto the portfolio: black letters on a white plate are screen-blended
 * over the photos, so white stays white and the photos only show through the letters.
 */
export default function FooterWordmark() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [covers, setCovers] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  /** Highest index mounted so far; photos load one step ahead of the one on show. */
  const [loaded, setLoaded] = useState(1);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
        if (entry.isIntersecting) {
          setCovers((current) => (current.length ? current : pickCovers()));
        }
        if (entry.intersectionRatio >= 0.4) root.dataset.inview = "";
      },
      { threshold: [0, 0.4] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || covers.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % covers.length;
        setLoaded((count) => Math.max(count, next + 1));
        return next;
      });
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, [onScreen, covers.length]);

  const previous = (active - 1 + covers.length) % covers.length;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative isolate mt-10 overflow-hidden md:mt-14"
    >
      {/* The outgoing photo stays opaque beneath the incoming one, so the letters never wash out mid-fade. */}
      {/* Inset so a sub-pixel sliver of photo can't peek past the white plate's edge while scaling. */}
      <div className="absolute inset-0.5 [filter:invert(1)_brightness(0.72)]">
        {covers.slice(0, loaded + 1).map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            quality={90}
            sizes="(min-width: 768px) 70vw, 100vw"
            data-active={index === active ? "" : undefined}
            data-previous={index === previous ? "" : undefined}
            className="z-0 scale-110 object-cover opacity-0 transition-[opacity,scale] duration-[2800ms,9000ms] ease-[cubic-bezier(0.45,0,0.55,1)] data-active:z-[2] data-active:scale-100 data-active:opacity-100 data-previous:z-[1] data-previous:scale-100 data-previous:opacity-100"
          />
        ))}
      </div>
      <p
        className={cn(
          WORDMARK_SIZE,
          "relative overflow-hidden bg-canvas pl-3 font-logo leading-none font-bold tracking-[-0.03em] whitespace-nowrap text-black uppercase mix-blend-screen md:pl-5",
        )}
      >
        {Array.from(SITE_SHORT_NAME.toUpperCase()).map((letter, index) => (
          <span
            key={index}
            data-footer-letter
            className="inline-block pb-[0.08em]"
            style={{ "--i": index } as React.CSSProperties}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </p>
    </div>
  );
}
