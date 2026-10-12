"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import Reveal from "@/components/common/Reveal";
import { GALLERIES, galleryHref, ROUTES } from "@/lib/constants";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";
import AboutHero from "./AboutHero";
import ExpandingImage, { type ReelFrame } from "./ExpandingImage";
import LitStatement from "./LitStatement";
import { useScrollProgress } from "./useScrollProgress";

const PORTRAIT = "/images/about/gautam.webp";

const LEGEND =
  "font-logo-sub text-[0.6875rem] leading-none tracking-[0.14em] text-ink/45 uppercase md:text-xs";
const EASE_OUT = "ease-[cubic-bezier(0.16,1,0.3,1)]";
/** Clears the fixed MENU and CONTACT labels on the right. */
const GUTTER = "px-3 pr-12 md:px-[5vw] md:pr-28";

const bySlug = (slug: string) => GALLERIES.find((g) => g.slug === slug)!;
const reelFrame = (slug: string, position: string, src?: string): ReelFrame => {
  const gallery = bySlug(slug);
  return {
    src: src ?? gallery.cover,
    caption: gallery.title,
    href: galleryHref(slug),
    position,
  };
};

/** The couples that open out full-screen after "Our approach". */
const REEL = [
  reelFrame(
    "sharon-ishan",
    "50% 45%",
    "/images/couples-wedding-folder/sharon-ishan/24.jpg",
  ),
  reelFrame("sofia-harshil", "50% 20%"),
  reelFrame("shivanee-rajat", "50% 58%"),
  reelFrame("inayat-jasdeep", "50% 25%"),
];

const BIO = [
  "Gautam came to weddings through people, not cameras. He is most at home in the in-between moments: a father straightening a turban, a sister\u2019s laugh before the pheras, the hush that falls when the music stops.",
  "His way of working is unhurried. He reads a room before he lifts the camera, earns the trust of your families, and lets the day unfold on its own terms. What you receive feels less like a record of the day and more like a memory of it.",
  "Based in India and travelling wherever love takes him, he keeps his calendar small, so every couple has his full attention.",
];

/** Gautam's portrait: wipes up into view, then drifts gently against the scroll. */
function Portrait() {
  const [ref, visible] = useReveal<HTMLDivElement>(0.2);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((progress: number) => {
    if (imageRef.current)
      imageRef.current.style.translate = `0 ${(progress - 0.5) * -8}%`;
  }, []);
  useScrollProgress(frameRef, onProgress);

  return (
    <div
      ref={ref}
      className="md:sticky md:top-0 md:flex md:h-svh md:items-center"
    >
      <div
        ref={frameRef}
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden bg-mist transition-[clip-path] duration-[1600ms] md:max-h-[82svh]",
          "ease-[cubic-bezier(0.76,0,0.24,1)]",
          visible ? "[clip-path:inset(0)]" : "[clip-path:inset(100%_0_0_0)]",
        )}
      >
        <div ref={imageRef} className="absolute inset-x-0 -inset-y-[6%]">
          <Image
            src={PORTRAIT}
            alt="Gautam Khullar"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className={cn(
              "object-cover grayscale transition-[scale] duration-[2600ms]",
              EASE_OUT,
              visible ? "scale-100" : "scale-[1.15]",
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default function AboutView() {
  return (
    <article className="bg-canvas text-ink">
      <AboutHero />

      {/* The idea behind the studio, lit word by word as it passes. */}
      <section
        className={cn(GUTTER, "pt-20 pb-12 text-center md:pt-28 md:pb-16")}
      >
        <Reveal>
          <p className={LEGEND}>Gautam Khullar Photography</p>
        </Reveal>
        <LitStatement
          className="mx-auto mt-8 max-w-[22ch] text-[9vw] leading-[1.12] tracking-[-0.01em] text-balance md:mt-10 md:max-w-[26ch] md:text-[4.2vw]"
          text="A wedding is never just two people. It is two families, a hundred rituals and a thousand *small glances.* We are there for all of it, and give it back to you *as it felt.*"
        />
      </section>

      {/* Gautam: portrait held on the left while his story scrolls beside it. */}
      <section
        className={cn(
          GUTTER,
          "grid gap-10 pt-4 md:grid-cols-[0.9fr_1fr] md:gap-[6vw] md:pt-0",
        )}
      >
        <Portrait />
        <div className="md:py-[12svh]">
          <Reveal>
            <p className={LEGEND}>Founder &amp; photographer</p>
            <h2 className="mt-5 font-display text-6xl leading-[0.95] md:text-8xl">
              Gautam
              <br />
              <span className="italic">Khullar</span>
            </h2>
          </Reveal>
          <div className="mt-10 space-y-6 md:mt-12">
            {BIO.map((paragraph, index) => (
              <Reveal key={index} delay={index * 80}>
                <p className="max-w-xl font-display text-xl leading-relaxed text-ink/75 md:text-2xl md:leading-relaxed">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <p className="font-script text-5xl text-ink/80 md:text-6xl">
              Gautam
            </p>
          </Reveal>
        </div>
      </section>

      {/* The approach, lit word by word as it passes. */}
      <section className={cn(GUTTER, "py-20 md:py-[14svh]")}>
        <p className={cn(LEGEND, "mb-8 md:mb-10")}>Our approach</p>
        <LitStatement text="We don't direct your day. We watch it closely, wait for the light, and keep the moments you didn't know were happening." />
      </section>

      <ExpandingImage frames={REEL} />

      {/* Closing line and the way in. */}
      <section
        className={cn(
          GUTTER,
          "border-t border-ink/15 pt-16 pb-20 md:pt-24 md:pb-28",
        )}
      >
        <h2 className="font-display text-[15vw] leading-[0.9] tracking-[-0.02em] md:text-[9vw]">
          {["Your story,", "told the way", "it felt."].map((line, index) => (
            <Reveal key={line} delay={index * 140}>
              <span
                className={cn(
                  "block",
                  index === 1 && "md:pl-[12vw]",
                  index === 2 && "italic md:pl-[24vw]",
                )}
              >
                {line}
              </span>
            </Reveal>
          ))}
        </h2>
        <Reveal
          delay={450}
          className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-6 md:mt-16"
        >
          <Link
            href={ROUTES.CONTACT}
            className="group flex items-center gap-4 border-b border-ink pb-2 font-logo text-2xl leading-none font-bold tracking-[-0.02em] uppercase md:text-4xl"
          >
            Begin with hello
            <span className="transition-transform duration-500 group-hover:translate-x-2">
              &rarr;
            </span>
          </Link>
          <Link
            href={ROUTES.PORTFOLIO}
            className="font-logo-sub text-xs tracking-[0.14em] text-ink/55 uppercase transition-colors hover:text-ink"
          >
            View the portfolio
          </Link>
        </Reveal>
      </section>
    </article>
  );
}
