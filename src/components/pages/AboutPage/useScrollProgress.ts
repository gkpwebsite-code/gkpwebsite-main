import { useEffect } from "react";

/**
 * Calls `onProgress` with how far `ref` has travelled through the viewport: 0 as its top enters
 * from the bottom, 1 as its bottom leaves at the top. Runs once per frame at most and never
 * re-renders, so callers write styles straight onto their elements.
 */
export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = element.getBoundingClientRect();
      const travel = window.innerHeight + height;
      onProgress(Math.min(Math.max((window.innerHeight - top) / travel, 0), 1));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, onProgress]);
}
