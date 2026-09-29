"use client";

import { useEffect } from "react";

const HOLD_MS = 1000;
const SETTLE_MS = 1600;

/** On every page load: blank screen with the logo centred, which then glides into its corner as the page is revealed. */
export default function Intro() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "done") return;

    const play = window.setTimeout(() => {
      root.dataset.intro = "play";
    }, HOLD_MS);
    const done = window.setTimeout(() => {
      root.dataset.intro = "done";
    }, HOLD_MS + SETTLE_MS);

    return () => {
      window.clearTimeout(play);
      window.clearTimeout(done);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="intro-overlay fixed inset-0 z-40 bg-canvas"
    />
  );
}
