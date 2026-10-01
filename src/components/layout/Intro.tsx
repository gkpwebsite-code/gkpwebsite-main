"use client";

import { useEffect, useRef } from "react";

/** Counter reaches 100% as the last letter lands; keep in step with the letter roll in globals.css. */
const MIN_LOAD_MS = 2000;
/** Counter holds at this value until the page, fonts and first-row images have loaded. */
const WAITING_CAP = 0.9;
/** Hard ceiling so a slow asset can never trap visitors behind the intro. */
const MAX_LOAD_MS = 8000;
/** How long the name holds centre while the overlay fades and the photos rise in behind it. */
const REVEAL_MS = 2000;
/** Time from the name leaving centre until every entrance animation has settled. */
const SETTLE_MS = 2300;

const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/** Gives each grid photo a random entrance slot so they rise in a different order every load. */
function shuffleRiseOrder() {
  const tiles = Array.from(
    document.querySelectorAll<HTMLElement>("[data-intro-rise]"),
  );
  const slots = tiles.map((_, index) => index);
  for (let index = slots.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [slots[index], slots[swap]] = [slots[swap], slots[index]];
  }
  tiles.forEach((tile, index) =>
    tile.style.setProperty("--i", String(slots[index])),
  );
}

/**
 * On every page load: letters roll on a blank screen while a 0–100% counter tracks loading,
 * the blank screen fades as photos rise in behind the centred name, then the name glides
 * into its corner.
 */
export default function Intro() {
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "done") return;

    let loaded = false;
    let frame = 0;
    let play = 0;
    let settle = 0;
    const start = performance.now();

    const markLoaded = () => {
      document.fonts.ready.then(() => {
        loaded = true;
      });
    };
    if (document.readyState === "complete") markLoaded();
    else window.addEventListener("load", markLoaded, { once: true });

    const tick = (now: number) => {
      const elapsed = now - start;
      const timed = easeInOut(Math.min(elapsed / MIN_LOAD_MS, 1));
      const ready = loaded || elapsed >= MAX_LOAD_MS;
      const progress = ready ? timed : Math.min(timed, WAITING_CAP);

      if (counterRef.current) {
        counterRef.current.textContent = `${Math.round(progress * 100)}%`;
      }

      if (progress >= 1) {
        shuffleRiseOrder();
        root.dataset.intro = "reveal";
        play = window.setTimeout(() => {
          root.dataset.intro = "play";
        }, REVEAL_MS);
        settle = window.setTimeout(() => {
          root.dataset.intro = "done";
        }, REVEAL_MS + SETTLE_MS);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(play);
      window.clearTimeout(settle);
      window.removeEventListener("load", markLoaded);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="intro-overlay fixed inset-0 z-40 flex items-end justify-center bg-canvas pb-6 text-ink md:pb-8"
    >
      <span
        ref={counterRef}
        className="font-logo-sub text-2xl leading-none font-normal tracking-[0.06em] tabular-nums md:text-3xl"
      >
        0%
      </span>
    </div>
  );
}
