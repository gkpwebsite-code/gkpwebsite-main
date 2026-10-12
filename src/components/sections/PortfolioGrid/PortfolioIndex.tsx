"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { galleryHref, type Gallery } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { placeOf } from "./places";

/** Text index of every wedding; on desktop the hovered couple's cover trails the cursor. */
export default function PortfolioIndex({
  galleries,
}: {
  galleries: readonly Gallery[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let placed = false;
    const tick = () => {
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      preview.style.translate = `${current.x}px ${current.y}px`;
      frame =
        Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.5
          ? requestAnimationFrame(tick)
          : 0;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!placed) {
        current.x = target.x;
        current.y = target.y;
        placed = true;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="min-h-svh px-3 pt-32 pr-12 pb-48 md:px-[5vw] md:pt-40 md:pr-28">
      <p className="flex justify-between font-logo-sub text-[0.6875rem] leading-none tracking-[0.14em] text-ink/45 uppercase md:text-xs">
        <span>Index &mdash; {galleries.length} stories</span>
        <span className="hidden md:block">Place</span>
      </p>

      <ul
        className="group/list mt-8 md:mt-12"
        onMouseLeave={() => setActive(null)}
      >
        {galleries.map((gallery, index) => (
          <li
            key={gallery.slug}
            onMouseEnter={() => setActive(gallery.slug)}
            className="border-t border-ink/15 transition-opacity duration-500 last:border-b pointer-fine:group-has-[li:hover]/list:opacity-30 pointer-fine:hover:!opacity-100"
          >
            <Link
              href={galleryHref(gallery.slug)}
              className="flex items-center gap-4 py-4 md:gap-8 md:py-6"
            >
              <span className="w-6 shrink-0 font-logo-sub text-[0.625rem] tracking-[0.14em] text-ink/40 tabular-nums md:w-10 md:text-xs">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[2rem] leading-[1.05] md:text-6xl lg:text-7xl">
                  {gallery.title}
                </span>
                <span className="mt-2 block font-logo-sub text-[0.6875rem] tracking-[0.14em] text-ink/50 uppercase md:hidden">
                  {placeOf(gallery)}
                </span>
              </span>
              <span className="hidden font-logo-sub text-xs tracking-[0.14em] text-ink/50 uppercase md:block">
                {placeOf(gallery)}
              </span>
              <span className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden md:hidden">
                <Image
                  src={gallery.cover}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-30 hidden pointer-fine:block"
      >
        <div
          className={cn(
            "relative -mt-[11rem] ml-10 aspect-[3/4] w-[16.5rem] overflow-hidden transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:w-[19rem]",
            active ? "scale-100 opacity-100" : "scale-90 opacity-0",
          )}
        >
          {galleries.map((gallery) => (
            <Image
              key={gallery.slug}
              src={gallery.cover}
              alt=""
              fill
              sizes="320px"
              className={cn(
                "object-cover transition-opacity duration-500",
                active === gallery.slug ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
