"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";

/** How long the visitor must be still before the page starts drifting. */
const IDLE_MS = 15000;
/** Drift speed in px per second — about what Bottega 53's grid moves at on desktop. */
const SPEED_PX_S = 60;
/** Eases up to full speed instead of lurching into motion. */
const RAMP_S = 1.2;

const ACTIVITY_EVENTS = [
  "mousemove",
  "wheel",
  "touchstart",
  "pointerdown",
  "keydown",
] as const;

/**
 * After a stretch of no input, slowly scrolls the page down at a steady pace and loops back
 * to the top at the end. Any mouse, wheel, touch or key input stops it and restarts the wait.
 * Runs on GSAP's ticker — the same frame loop that drives Lenis — so the two never drift apart.
 */
export function useIdleAutoScroll(enabled: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!enabled) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let idleTimer = 0;
    let running = false;
    let position = 0;
    let runTime = 0;
    let frameMs = 1000 / 60;

    const maxScroll = () =>
      lenis
        ? lenis.limit
        : document.documentElement.scrollHeight - window.innerHeight;

    const jump = (y: number) => {
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };

    // Waits out the intro, an open menu (Lenis stopped) and background tabs without giving up.
    const blocked = () =>
      document.hidden ||
      document.documentElement.dataset.intro !== "done" ||
      Boolean(lenis?.isStopped);

    const step = (_time: number, deltaMs: number) => {
      if (blocked()) return;
      const limit = maxScroll();
      if (limit <= 0) return;
      // Track the display's real frame interval (60Hz, 120Hz ProMotion…), ignoring hiccups.
      if (deltaMs > 4 && deltaMs < 50) frameMs += (deltaMs - frameMs) * 0.05;
      // Move a fixed whole number of device pixels every frame: steps that alternate
      // (0.5px, 1.5px, 1px…) read as judder at slow speeds, even steps read as a glide.
      const dpr = window.devicePixelRatio || 1;
      const perFrame =
        Math.max(1, Math.round((SPEED_PX_S * frameMs * dpr) / 1000)) / dpr;
      runTime += frameMs / 1000;
      const ramp = Math.min(runTime / RAMP_S, 1);
      // Smoothstep so the start feels like a glide rather than a jolt.
      const eased = ramp * ramp * (3 - 2 * ramp);
      position += perFrame * eased;
      if (position >= limit) {
        position = 0;
        runTime = 0;
      }
      jump(Math.round(position * dpr) / dpr);
    };

    const start = () => {
      if (running) return;
      position = lenis ? lenis.scroll : window.scrollY;
      runTime = 0;
      running = true;
      gsap.ticker.add(step);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(step);
    };

    const onActivity = () => {
      stop();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(start, IDLE_MS);
    };

    ACTIVITY_EVENTS.forEach((type) =>
      window.addEventListener(type, onActivity, { passive: true }),
    );
    idleTimer = window.setTimeout(start, IDLE_MS);

    return () => {
      stop();
      window.clearTimeout(idleTimer);
      ACTIVITY_EVENTS.forEach((type) =>
        window.removeEventListener(type, onActivity),
      );
    };
  }, [enabled, lenis]);
}
