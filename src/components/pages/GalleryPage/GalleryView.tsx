"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Gallery, GalleryImage } from "@/lib/constants";
import { allowHorizontalGestures, useLenis } from "@/lib/lenis";

/** Seconds of no scrolling, swiping or key presses before the gallery starts drifting on its own. */
const AUTOSCROLL_IDLE_MS = 5000;
/** Auto-scroll drift speed in pixels per second. */
const AUTOSCROLL_SPEED = 60;
/** Time for auto-scroll to ease up to full speed so it never lurches into motion. */
const AUTOSCROLL_RAMP_MS = 1200;

const INTERACTION_EVENTS = ["wheel", "touchstart", "touchmove", "pointerdown", "keydown"] as const;

function imageSizes({ width, height }: GalleryImage) {
  return width > height ? "(min-width: 768px) 90vw, 180vw" : "(min-width: 768px) 45vw, 100vw";
}

export default function GalleryView({ gallery }: { gallery: Gallery }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [firstName, secondName] = gallery.title.split(" & ");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    root.dataset.gallery = "";

    let frame = 0;
    const enter = () => {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          section.dataset.entered = "";
        });
      });
    };

    let introObserver: MutationObserver | undefined;
    if (root.dataset.intro) {
      enter();
    } else {
      introObserver = new MutationObserver(() => {
        if (!root.dataset.intro) return;
        introObserver?.disconnect();
        enter();
      });
      introObserver.observe(root, { attributeFilter: ["data-intro"] });
    }

    return () => {
      introObserver?.disconnect();
      cancelAnimationFrame(frame);
      delete root.dataset.gallery;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let sectionTop = 0;
    let maxOffset = 0;

    const currentScroll = () => (lenis ? lenis.scroll : window.scrollY);

    const measure = () => {
      maxOffset = Math.max(track.scrollWidth - window.innerWidth, 0);
      section.style.height = `${maxOffset + window.innerHeight}px`;
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
    };

    const render = () => {
      const offset = Math.min(Math.max(currentScroll() - sectionTop, 0), maxOffset);
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    measure();
    render();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      render();
    });
    resizeObserver.observe(track);
    window.addEventListener("resize", measure);

    const unsubscribeScroll = lenis?.on("scroll", render);
    if (!lenis) window.addEventListener("scroll", render, { passive: true });

    const restoreGestures = allowHorizontalGestures();

    let lastInteraction = performance.now();
    const markInteraction = () => {
      lastInteraction = performance.now();
    };
    INTERACTION_EVENTS.forEach((type) =>
      window.addEventListener(type, markInteraction, { passive: true }),
    );

    let frame = 0;
    let previous = performance.now();
    let ramp = 0;
    let carry = 0;

    const autoscroll = (now: number) => {
      const elapsed = now - previous;
      previous = now;

      if (root.dataset.intro !== "done" || section.dataset.entered === undefined) {
        lastInteraction = now;
      }

      const scroll = currentScroll();
      const inGallery = scroll >= sectionTop - 1 && scroll < sectionTop + maxOffset - 1;
      const idle = now - lastInteraction > AUTOSCROLL_IDLE_MS;

      if (!reducedMotion && idle && inGallery) {
        ramp = Math.min(ramp + elapsed / AUTOSCROLL_RAMP_MS, 1);
        const step = ((AUTOSCROLL_SPEED * elapsed) / 1000) * ramp;
        if (lenis) {
          lenis.scrollTo(scroll + step, { immediate: true });
        } else {
          carry += step;
          const whole = Math.floor(carry);
          if (whole > 0) {
            window.scrollBy(0, whole);
            carry -= whole;
          }
        }
      } else {
        ramp = 0;
      }

      frame = requestAnimationFrame(autoscroll);
    };
    frame = requestAnimationFrame(autoscroll);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      unsubscribeScroll?.();
      window.removeEventListener("scroll", render);
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, markInteraction));
      restoreGestures();
    };
  }, [lenis]);

  return (
    <section ref={sectionRef} className="relative bg-canvas text-ink">
      <h1 className="sr-only">{gallery.title}</h1>
      <div className="sticky top-0 h-svh overflow-hidden">
        <div ref={trackRef} className="flex h-full w-max items-center will-change-transform">
          <div className="flex h-full w-screen shrink-0 flex-col items-center justify-center px-8 text-center md:w-[50vw]">
            <p
              data-gallery-fade
              style={{ "--i": 0 } as React.CSSProperties}
              className="font-logo-sub text-[0.6875rem] leading-none tracking-[0.15em] uppercase md:text-xs"
            >
              {gallery.subtitle}
            </p>
            <p
              aria-hidden="true"
              className="mt-8 font-display text-6xl leading-[0.95] md:text-7xl lg:text-8xl"
            >
              <span className="-mx-[0.15em] -my-[0.1em] block overflow-hidden px-[0.15em] py-[0.1em]">
                <span data-gallery-line className="block" style={{ "--i": 1 } as React.CSSProperties}>
                  {firstName}
                  {secondName && (
                    <span className="ml-3 align-middle text-3xl md:text-4xl">&amp;</span>
                  )}
                </span>
              </span>
              {secondName && (
                <span className="-mx-[0.15em] -my-[0.1em] block overflow-hidden px-[0.15em] py-[0.1em]">
                  <em
                    data-gallery-line
                    className="block italic"
                    style={{ "--i": 2 } as React.CSSProperties}
                  >
                    {secondName}
                  </em>
                </span>
              )}
            </p>
            <p
              data-gallery-fade
              style={{ "--i": 3 } as React.CSSProperties}
              className="mt-10 font-logo-sub text-[0.6875rem] leading-none tracking-[0.15em] text-muted uppercase md:text-xs"
            >
              {gallery.images.length} Photographs
            </p>
          </div>

          <div className="relative h-full w-screen shrink-0 overflow-hidden md:w-[50vw]">
            <div data-gallery-cover className="absolute inset-0">
              <div className="absolute inset-0">
                <Image
                  src={gallery.cover}
                  alt={gallery.title}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  quality={90}
                  sizes="(min-width: 768px) 75vw, 150vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex h-full shrink-0 items-center gap-[5vw] px-[7vw] md:gap-[4vw] md:px-[6vw]">
            {gallery.images.map((image, index) => (
              <div
                key={image.src}
                className="relative h-[62svh] shrink-0 md:h-[74svh]"
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
              >
                <Image
                  src={image.src}
                  alt={`${gallery.title}, photograph ${index + 1}`}
                  fill
                  quality={90}
                  sizes={imageSizes(image)}
                  data-gallery-photo
                  onLoad={(event) => {
                    event.currentTarget.dataset.loaded = "";
                  }}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
