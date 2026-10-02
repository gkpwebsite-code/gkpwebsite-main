"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { galleryHref, type Gallery } from "@/lib/constants";
import { useLenis } from "@/lib/lenis";

const HEADING = "Next Wedding";
const HEADING_CLASS =
  "font-logo text-[12vw] leading-[0.9] font-bold tracking-[-0.03em] whitespace-nowrap uppercase md:text-[5vw]";

/** Resting tilt of the hover photo, in degrees. */
const BASE_TILT = -5;
/** How quickly the hover photo catches up with the cursor (0–1 per frame). */
const FOLLOW_EASE = 0.12;

/**
 * Closing panel of a gallery, half the screen like the opening names panel. The heading fills
 * from grey to black as the panel scrolls in; on desktop the next couple's cover trails the cursor.
 */
export default function NextWedding({ gallery }: { gallery: Gallery }) {
  const panelRef = useRef<HTMLAnchorElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [firstName, secondName] = gallery.title.split(" & ");

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = panel.getBoundingClientRect();
      const sideways = window.matchMedia("(min-width: 48rem)").matches;
      const entered = sideways
        ? (window.innerWidth - rect.left) / rect.width
        : (window.innerHeight - rect.top) / rect.height;
      panel.style.setProperty(
        "--next-progress",
        String(Math.min(Math.max(entered, 0), 1)),
      );
    };
    // Waits a frame so the gallery has moved its track before the panel is measured.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    const unsubscribe = lenis?.on("scroll", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe?.();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [lenis]);

  useEffect(() => {
    const panel = panelRef.current;
    const follower = followerRef.current;
    if (!panel || !follower) return;

    const target = { x: 0, y: 0 };
    const position = { x: 0, y: 0 };
    let frame = 0;
    let hovering = false;
    let stopTimer = 0;

    const pointFrom = (event: PointerEvent) => {
      const rect = panel.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
    };

    const tick = () => {
      position.x += (target.x - position.x) * FOLLOW_EASE;
      position.y += (target.y - position.y) * FOLLOW_EASE;
      // Leans into the direction of travel, then settles back to its resting tilt.
      const lean = Math.min(Math.max((target.x - position.x) * 0.06, -10), 10);
      follower.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) rotate(${BASE_TILT + lean}deg)`;
      frame = requestAnimationFrame(tick);
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointFrom(event);
      position.x = target.x;
      position.y = target.y;
      hovering = true;
      window.clearTimeout(stopTimer);
      follower.dataset.active = "";
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      if (hovering) pointFrom(event);
    };
    const onLeave = () => {
      hovering = false;
      delete follower.dataset.active;
      // Keeps easing while the photo fades out, then stops the loop.
      stopTimer = window.setTimeout(() => {
        cancelAnimationFrame(frame);
        frame = 0;
      }, 700);
    };

    panel.addEventListener("pointerenter", onEnter);
    panel.addEventListener("pointermove", onMove);
    panel.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(stopTimer);
      panel.removeEventListener("pointerenter", onEnter);
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <Link
      ref={panelRef}
      href={galleryHref(gallery.slug)}
      data-gallery-snap
      aria-label={`Next wedding: ${gallery.title}`}
      className="relative flex h-svh w-full shrink-0 flex-col items-center justify-center overflow-hidden px-8 text-center md:h-full md:w-[50vw]"
    >
      <span aria-hidden="true" className="relative inline-block">
        <span className={`${HEADING_CLASS} block text-ink/15`}>{HEADING}</span>
        <span
          className={`${HEADING_CLASS} absolute inset-0 block text-ink`}
          style={{
            clipPath: "inset(0 calc((1 - var(--next-progress, 0)) * 100%) 0 0)",
          }}
        >
          {HEADING}
        </span>
        <span className="mt-3 block h-px w-full bg-ink/15 md:mt-4">
          <span
            className="block h-full origin-left bg-ink"
            style={{ scale: "var(--next-progress, 0) 1" }}
          />
        </span>
      </span>

      <span
        aria-hidden="true"
        className="mt-8 font-display text-3xl leading-none md:mt-10 md:text-4xl lg:text-5xl"
      >
        {firstName}
        {secondName && (
          <>
            <span className="mx-2 text-xl md:text-2xl">&amp;</span>
            <em className="italic">{secondName}</em>
          </>
        )}
      </span>

      {/* Phones have no cursor to follow, so the cover simply sits under the names. */}
      <span className="relative mt-12 block aspect-[3/4] w-[52vw] -rotate-3 md:hidden">
        <Image
          src={gallery.cover}
          alt=""
          fill
          quality={90}
          sizes="52vw"
          className="object-cover"
        />
      </span>

      <div
        ref={followerRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 hidden aspect-[3/4] w-[16vw] opacity-0 transition-opacity duration-500 data-active:opacity-100 md:block"
      >
        <div className="absolute inset-0 scale-90 transition-[scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-active:scale-100">
          <Image
            src={gallery.cover}
            alt=""
            fill
            quality={90}
            sizes="16vw"
            className="object-cover shadow-[0_1.5rem_3rem_-1rem_rgb(0_0_0/0.35)]"
          />
        </div>
      </div>
    </Link>
  );
}
