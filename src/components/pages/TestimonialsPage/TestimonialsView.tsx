"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import Reveal from "@/components/common/Reveal";
import LitStatement from "@/components/pages/AboutPage/LitStatement";
import { useScrollProgress } from "@/components/pages/AboutPage/useScrollProgress";
import { ROUTES } from "@/lib/constants";
import type { TestimonialEntry, TestimonialsContent } from "@/lib/site-content";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

const LEGEND =
  "font-logo-sub text-[0.6875rem] leading-none tracking-[0.14em] text-ink/45 uppercase md:text-xs";
/** Clears the fixed MENU and CONTACT labels on the right. */
const GUTTER = "px-3 pr-12 md:px-[5vw] md:pr-28";

/** Renders `*phrase*` in italics. */
function withItalics(text: string) {
  return text
    .split("*")
    .map((part, index) =>
      index % 2 ? <em key={index}>{part}</em> : <span key={index}>{part}</span>,
    );
}

/** The couple's photograph: wipes up into view, then drifts gently against the scroll. */
function Photograph({ src, alt }: { src: string; alt: string }) {
  const [ref, visible] = useReveal<HTMLDivElement>(0.2);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((progress: number) => {
    if (imageRef.current)
      imageRef.current.style.translate = `0 ${(progress - 0.5) * -10}%`;
  }, []);
  useScrollProgress(frameRef, onProgress);

  return (
    <div ref={ref}>
      <div
        ref={frameRef}
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden bg-mist transition-[clip-path] duration-[1600ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          visible ? "[clip-path:inset(0)]" : "[clip-path:inset(100%_0_0_0)]",
        )}
      >
        <div ref={imageRef} className="absolute inset-x-0 -inset-y-[8%]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className={cn(
              "object-cover transition-[scale] duration-[2600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              visible ? "scale-100" : "scale-[1.15]",
            )}
          />
        </div>
      </div>
    </div>
  );
}

/** One couple: photograph on one side, their words on the other, alternating down the page. */
function Chapter({
  testimonial,
  index,
}: {
  testimonial: TestimonialEntry;
  index: number;
}) {
  const flipped = index % 2 === 1;

  return (
    <li className="grid items-center gap-10 border-t border-ink/15 py-16 md:grid-cols-12 md:gap-0 md:py-[12svh]">
      <div
        className={cn(
          "md:col-span-5 md:row-start-1",
          flipped ? "md:col-start-8" : "md:col-start-1",
        )}
      >
        <Photograph src={testimonial.photo} alt={testimonial.name} />
      </div>

      <div
        className={cn(
          "md:col-span-6 md:row-start-1",
          flipped ? "md:col-start-1" : "md:col-start-7",
        )}
      >
        <Reveal>
          <p className={LEGEND}>{String(index + 1).padStart(2, "0")}</p>
        </Reveal>
        <Reveal delay={100}>
          <blockquote className="mt-6 font-display text-[2.4rem] leading-[1.05] tracking-[-0.01em] text-balance md:mt-8 md:text-[min(4.2vw,8svh)]">
            <span aria-hidden="true">&ldquo;</span>
            {withItalics(testimonial.quote)}
            <span aria-hidden="true">&rdquo;</span>
          </blockquote>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 max-w-md font-display text-lg leading-relaxed text-ink/70 md:mt-10 md:text-xl md:leading-relaxed">
            {testimonial.body}
          </p>
        </Reveal>
        <Reveal
          delay={300}
          className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3"
        >
          <p className="font-logo text-base leading-none font-bold tracking-[-0.01em] uppercase md:text-lg">
            {testimonial.name}
          </p>
          <Link
            href={testimonial.href}
            className="group inline-flex items-center gap-2 font-logo-sub text-[0.6875rem] tracking-[0.14em] text-ink/55 uppercase transition-colors hover:text-ink md:text-xs"
          >
            View their story
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
            >
              &rarr;
            </span>
          </Link>
        </Reveal>
      </div>
    </li>
  );
}

export default function TestimonialsView({
  content,
}: {
  content: TestimonialsContent;
}) {
  return (
    <article className="bg-canvas text-ink">
      <header className={cn(GUTTER, "pt-32 md:pt-40")}>
        <Reveal>
          <p className={LEGEND}>Testimonials</p>
        </Reveal>
        <h1 className="mt-6 font-display text-[22vw] leading-[0.85] tracking-[-0.03em] md:text-[13vw]">
          {["Kind", "words."].map((line, index) => (
            <Reveal key={line} delay={100 + index * 140}>
              <span className={cn("block", index === 1 && "pl-[0.9em] italic")}>
                {line}
              </span>
            </Reveal>
          ))}
        </h1>
      </header>

      {/* The line couples say to us most, lit word by word as it passes. */}
      <section className={cn(GUTTER, "py-20 text-center md:py-[16svh]")}>
        <LitStatement
          className="mx-auto max-w-[22ch] text-[8.5vw] leading-[1.12] tracking-[-0.01em] text-balance md:max-w-[24ch] md:text-[4.2vw]"
          text={`\u201C${content.featuredQuote}\u201D`}
        />
      </section>

      <ol className={GUTTER}>
        {content.testimonials.map((testimonial, index) => (
          <Chapter
            key={testimonial.href}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </ol>

      {/* Closing line and the way in. */}
      <section
        className={cn(
          GUTTER,
          "border-t border-ink/15 pt-16 pb-20 md:pt-24 md:pb-28",
        )}
      >
        <h2 className="font-display text-[15vw] leading-[0.9] tracking-[-0.02em] md:text-[9vw]">
          {["Your story", "could be next."].map((line, index) => (
            <Reveal key={line} delay={index * 140}>
              <span
                className={cn("block", index === 1 && "italic md:pl-[12vw]")}
              >
                {line}
              </span>
            </Reveal>
          ))}
        </h2>
        <Reveal
          delay={300}
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
