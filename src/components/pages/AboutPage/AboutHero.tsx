"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "./useScrollProgress";

/** Landscape photographs only: they fill a desktop screen without heavy cropping. */
const FRAMES: readonly string[] = [
  "/images/couples-wedding-folder/sharon-ishan/16.jpg",
  "/images/couples-wedding-folder/sharon-ishan/12.jpg",
];
const HOLD_MS = 5000;

/** A random frame other than the one showing. */
function randomFrame(current: number) {
  const offset = 1 + Math.floor(Math.random() * (FRAMES.length - 1));
  return (current + offset) % FRAMES.length;
}

/**
 * Full-screen opening with the page title set large over it. Behind it, couples crossfade in
 * a random order. As the page scrolls, the photographs sink slowly behind
 * the title, which lifts and fades away.
 */
export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (FRAMES.length < 2) return;
    const timer = setTimeout(() => setCurrent(randomFrame(current)), HOLD_MS);
    return () => clearTimeout(timer);
  }, [current]);

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
        {FRAMES.map((frame, index) => (
          <div
            key={frame}
            className={cn(
              "absolute inset-0 transition-[opacity,scale] ease-[cubic-bezier(0.16,1,0.3,1)]",
              index === current
                ? "z-20 scale-[1.08] opacity-100 duration-[1800ms,7000ms]"
                : "z-10 scale-[1.16] opacity-0 delay-[1800ms] duration-0",
            )}
          >
            <Image
              src={frame}
              alt={index === current ? "A couple on their wedding day" : ""}
              fill
              preload={index === 0}
              quality={90}
              sizes="100vw"
              className="object-cover"
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
