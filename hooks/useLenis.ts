"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap";

export function useLenis() {
  useEffect(() => {
    registerGsapPlugins();

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);
}
