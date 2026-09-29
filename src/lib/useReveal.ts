"use client";

import { useState, useSyncExternalStore } from "react";

type RevealStore = {
  ref: (node: Element | null) => void;
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => boolean;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createRevealStore(threshold: number, rootMargin: string): RevealStore {
  let visible = false;
  let node: Element | null = null;
  let observer: IntersectionObserver | null = null;
  const listeners = new Set<() => void>();

  const disconnect = () => {
    observer?.disconnect();
    observer = null;
  };

  const observe = () => {
    if (visible || observer || !node || listeners.size === 0) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        visible = true;
        disconnect();
        listeners.forEach((listener) => listener());
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
  };

  return {
    ref(element) {
      disconnect();
      node = element;
      observe();
    },
    subscribe(onChange) {
      listeners.add(onChange);
      observe();
      return () => {
        listeners.delete(onChange);
        if (listeners.size === 0) disconnect();
      };
    },
    getSnapshot: () => visible || prefersReducedMotion(),
  };
}

const getServerSnapshot = () => false;

/** Fires once when the element enters the viewport; always true under reduced motion. */
export function useReveal<T extends Element = HTMLDivElement>(
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
) {
  const [store] = useState(() => createRevealStore(threshold, rootMargin));
  const visible = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSnapshot,
  );
  return [store.ref as (node: T | null) => void, visible] as const;
}
