"use client";

import { useEffect } from "react";

/**
 * Discourages casual copying of the photographs on the public site: no right-click "Save
 * image", no dragging a photo out to the desktop, and no long-press save menu on phones.
 * Screenshots still work, so this only stops the easy routes. Mounted by the site layout only,
 * so Sanity Studio keeps normal image handling.
 */
export default function ImageGuard() {
  useEffect(() => {
    const root = document.documentElement;
    // Turns on the CSS that disables dragging and the phone long-press menu (globals.css).
    root.dataset.protect = "";

    const isMedia = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("img, video, picture"));
    const block = (event: Event) => {
      if (isMedia(event.target)) event.preventDefault();
    };

    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    return () => {
      delete root.dataset.protect;
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);

  return null;
}
