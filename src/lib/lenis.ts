"use client";

import { useSyncExternalStore } from "react";
import type Lenis from "lenis";

let instance: Lenis | null = null;
const listeners = new Set<() => void>();

/** Registers the app-wide smooth-scroll instance; called by SmoothScroll only. */
export function setLenis(next: Lenis | null) {
  instance = next;
  listeners.forEach((listener) => listener());
}

/** Lets horizontal trackpad swipes drive scrolling too (for sideways galleries); returns an undo. */
export function allowHorizontalGestures() {
  const lenis = instance;
  if (!lenis) return () => {};
  const previous = lenis.options.gestureOrientation;
  lenis.options.gestureOrientation = "both";
  return () => {
    lenis.options.gestureOrientation = previous;
  };
}

/** Freezes page scrolling, e.g. while the full-screen menu is open. */
export function pauseScroll() {
  instance?.stop();
}

/** Resumes page scrolling, unless the opening intro is still holding it. */
export function resumeScroll() {
  if (document.documentElement.dataset.intro === "done") instance?.start();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** The app-wide Lenis instance, or null before it starts or under reduced motion. */
export function useLenis() {
  return useSyncExternalStore(
    subscribe,
    () => instance,
    () => null,
  );
}
