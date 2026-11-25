import type { AboutFrame } from "@/lib/about";

const isPortrait = (frame: AboutFrame) => frame.height > frame.width;

/**
 * Landscape photos fill the screen. Portrait photos fill a phone, but on a wide screen they
 * show whole at full height on dark ground: cropping a portrait to a landscape screen keeps
 * barely half of it and blows it up past its resolution.
 */
export function fitClass(frame: AboutFrame) {
  return isPortrait(frame)
    ? "object-cover landscape:object-contain"
    : "object-cover";
}

/** How wide the photo actually renders, so the browser fetches a sharp-enough copy. */
export function fitSizes(frame: AboutFrame) {
  if (isPortrait(frame)) return "(orientation: landscape) 80vh, 100vw";
  const ratio = (frame.width / frame.height).toFixed(2);
  // On a tall screen a covering landscape is as wide as the screen height × its ratio.
  return `(orientation: portrait) calc(100vh * ${ratio}), 100vw`;
}
