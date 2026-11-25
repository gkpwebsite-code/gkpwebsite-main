"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AboutFrame } from "@/lib/about";
import { cn } from "@/lib/utils";
import { fitClass, fitSizes } from "./frameFit";
import { useScrollProgress } from "./useScrollProgress";

const HOLD_MS = 5000;

function shuffle<T>(list: readonly T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/**
 * Full-screen opening with the page title set large over it. Behind it, photographs
 * crossfade: the ones chosen in Sanity in their set order, or random landscapes from the
 * couples. As the page scrolls, the photographs sink slowly behind the title, which lifts
 * and fades away.
 */
export default function AboutHero({
  frames,
  shuffled,
}: {
  frames: readonly AboutFrame[];
  /** Random order per visit (fallback photos) rather than the order set in Sanity. */
  shuffled: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  // Order is settled in the browser (random for fallback photos); the first photo then fades
  // in over the dark ground instead of swapping out a server-rendered one.
  const [order, setOrder] = useState<readonly AboutFrame[]>([]);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame = 0;
    const id = window.setTimeout(() => {
      setOrder(shuffled ? shuffle(frames) : frames);
      setStep(0);
      // Two frames later, so the first photo mounts hidden and then transitions in.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setReady(true));
      });
    }, 0);
    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(frame);
    };
  }, [frames, shuffled]);

  useEffect(() => {
    if (order.length < 2) return;
    const timer = setTimeout(() => setStep((current) => current + 1), HOLD_MS);
    return () => clearTimeout(timer);
  }, [step, order]);

  // Only the photo showing, the one fading out beneath it and the next one (preloading).
  const at = (offset: number): AboutFrame | undefined =>
    order.length
      ? order[(step + offset + order.length) % order.length]
      : undefined;
  const current = at(0);
  const mounted = [step > 0 ? at(-1) : undefined, current, at(1)].filter(
    (frame, index, list): frame is AboutFrame =>
      Boolean(frame) && list.indexOf(frame) === index,
  );

  const onProgress = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const { top, height } = section.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-top / height, 0), 1);
    if (imageRef.current)
      imageRef.current.style.translate = `0 ${scrolled * 30}%`;
    if (titleRef.current) {
      titleRef.current.style.translate = `0 ${scrolled * -40}%`;
      titleRef.current.style.opacity = String(1 - scrolled * 1.6);
    }
  }, []);
  useScrollProgress(sectionRef, onProgress);

  return (
    <section
      ref={sectionRef}
      className="relative h-svh overflow-hidden bg-ink text-white"
    >
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform motion-safe:animate-[about-hero-settle_2400ms_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        {mounted.map((frame) => (
          <div
            key={frame.src}
            className={cn(
              // A gentle drift from 104% to true size, never enlarged past its resolution.
              "absolute inset-0 transition-[opacity,scale] ease-[cubic-bezier(0.16,1,0.3,1)]",
              ready && frame === current
                ? "z-20 scale-100 opacity-100 duration-[1800ms,7000ms]"
                : "z-10 scale-[1.04] opacity-0 delay-[1800ms] duration-0",
            )}
          >
            <Image
              src={frame.src}
              alt={frame === current ? "A couple on their wedding day" : ""}
              fill
              loading={frame === current ? "eager" : "lazy"}
              quality={90}
              sizes={fitSizes(frame)}
              className={fitClass(frame)}
              style={{ objectPosition: frame.position }}
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-30 bg-linear-to-t from-black/50 via-black/5 to-black/20" />

      <div
        ref={titleRef}
        className="absolute inset-x-3 bottom-8 z-40 pr-9 will-change-transform md:inset-x-[5vw] md:bottom-12 md:pr-20"
      >
        <div className="mb-6 md:mb-8">
          <div className="overflow-hidden">
            <p
              data-inquire-line
              className="flex items-center gap-3 font-logo-sub text-[0.6875rem] leading-none tracking-[0.14em] uppercase md:text-xs"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <span className="motion-safe:animate-[about-hero-nudge_2s_ease-in-out_infinite]">
                &darr;
              </span>
              Scroll to explore
            </p>
          </div>
        </div>
        <h1 className="font-display text-[26vw] leading-[0.8] tracking-[-0.03em] md:text-[17vw]">
          {["About", "us."].map((word, index) => (
            <span
              key={word}
              className="-mx-[0.12em] -mb-[0.16em] block overflow-hidden px-[0.12em] pb-[0.16em]"
            >
              <span
                data-inquire-line
                className={index ? "block pl-[1em] italic" : "block"}
                style={{ "--i": index + 1 } as React.CSSProperties}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
