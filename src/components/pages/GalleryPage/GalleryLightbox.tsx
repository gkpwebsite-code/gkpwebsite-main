"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { GalleryImage } from "@/lib/constants";
import { pauseScroll, resumeScroll } from "@/lib/lenis";
import { SIDE_LABEL } from "@/lib/sideLabel";
import { cn } from "@/lib/utils";

type GalleryLightboxProps = {
  images: readonly GalleryImage[];
  title: string;
  /** Photo to open on, or null when closed. */
  openAt: number | null;
  /** Called with the photo being viewed, so the page can land on it. */
  onClose: (index: number) => void;
};

const HIDE_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Phone-only full-screen viewer: swipe between photos, or jump via the thumbnail strip. */
export default function GalleryLightbox({
  images,
  title,
  openAt,
  onClose,
}: GalleryLightboxProps) {
  const open = openAt !== null;
  const slidesRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const slides = slidesRef.current;
    const thumbs = thumbsRef.current;
    if (openAt === null || !slides || !thumbs) return;

    const root = document.documentElement;
    pauseScroll();
    root.style.overflow = "hidden";

    // Active thumbnail is marked straight on the DOM so swiping never re-renders the photos.
    let current = -1;
    const select = (index: number, smooth: boolean) => {
      if (index === current) return;
      current = index;
      activeRef.current = index;
      const thumbList = Array.from(
        thumbs.children as HTMLCollectionOf<HTMLElement>,
      );
      thumbList.forEach((thumb, i) =>
        thumb.toggleAttribute("data-active", i === index),
      );
      const thumb = thumbList[index];
      if (!thumb) return;
      thumbs.scrollTo({
        left: thumb.offsetLeft - (thumbs.clientWidth - thumb.offsetWidth) / 2,
        behavior: smooth ? "smooth" : "instant",
      });
    };

    slides.scrollLeft = openAt * slides.clientWidth;
    select(openAt, false);

    const onScroll = () =>
      select(Math.round(slides.scrollLeft / slides.clientWidth), true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose(activeRef.current);
    };
    slides.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      slides.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
      resumeScroll();
    };
  }, [openAt, onClose]);

  const goTo = (index: number) => {
    const slides = slidesRef.current;
    slides?.scrollTo({ left: index * slides.clientWidth, behavior: "smooth" });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, all photographs`}
      inert={!open}
      data-open={open ? "" : undefined}
      className="group/lightbox invisible fixed inset-0 z-[70] flex flex-col bg-canvas text-ink opacity-0 transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] data-open:visible data-open:opacity-100 md:hidden"
    >
      <div
        ref={slidesRef}
        className={cn(
          "flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pt-20 pb-4",
          "scale-[0.96] transition-[scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-open/lightbox:scale-100",
          HIDE_SCROLLBAR,
        )}
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            className="relative w-full shrink-0 snap-center snap-always"
          >
            <Image
              src={image.src}
              alt={`${title}, photograph ${index + 1}`}
              fill
              quality={90}
              sizes="100vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <div className="flex items-end gap-3 px-3 pt-3 pb-8">
        <div
          ref={thumbsRef}
          className={cn(
            "relative flex min-w-0 flex-1 gap-1.5 overflow-x-auto",
            HIDE_SCROLLBAR,
          )}
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show photograph ${index + 1}`}
              className="relative h-16 w-12 shrink-0 cursor-pointer overflow-hidden opacity-40 transition-opacity duration-500 data-active:opacity-100"
            >
              <Image
                src={image.src}
                alt=""
                fill
                quality={90}
                sizes="48px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onClose(activeRef.current)}
          className={cn(
            SIDE_LABEL,
            "shrink-0 text-ink transition-opacity duration-300 hover:opacity-60",
          )}
        >
          Close
        </button>
      </div>
    </div>
  );
}
