"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const pathRef = useRef(pathname);
  const positionsRef = useRef(new Map<string, number>());
  const cameBackRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const root = document.documentElement;
    const introObserver = new MutationObserver(() => {
      if (root.dataset.intro !== "done") return;
      lenis.start();
      introObserver.disconnect();
    });
    if (root.dataset.intro !== "done") {
      lenis.stop();
      introObserver.observe(root, { attributeFilter: ["data-intro"] });
    }

    return () => {
      introObserver.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  // Remembers where each page was left, so Back/Forward returns to the same spot.
  useEffect(() => {
    const onPopState = () => {
      cameBackRef.current = true;
    };
    const onScroll = () => {
      positionsRef.current.set(pathRef.current, window.scrollY);
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // New pages open at the top; Back/Forward lands where the visitor left that page.
  useLayoutEffect(() => {
    pathRef.current = pathname;
    const target = cameBackRef.current
      ? (positionsRef.current.get(pathname) ?? 0)
      : 0;
    cameBackRef.current = false;

    const jump = () => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target, { immediate: true, force: true });
      } else {
        window.scrollTo(0, target);
      }
    };
    jump();
    if (target === 0) return;

    // The page may still be growing (streamed content); keep trying until it's tall enough.
    let frame = 0;
    let tries = 0;
    const settle = () => {
      const reachable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (reachable >= target || tries++ > 60) {
        jump();
        return;
      }
      frame = requestAnimationFrame(settle);
    };
    frame = requestAnimationFrame(settle);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
