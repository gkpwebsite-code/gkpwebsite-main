"use client";

import { useEffect, useRef, useState } from "react";

/** Assumed shape until the clip reports its own (film clips are usually portrait). */
const DEFAULT_RATIO = 9 / 16;

/**
 * A film clip set into the gallery strip between photographs: muted and looping, playing only
 * while it's on screen so the page never runs several videos at once.
 */
export default function GalleryClip({
  src,
  poster,
  label,
}: {
  src: string;
  /** Shown before the first frame arrives. */
  poster?: string;
  label: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ratio, setRatio] = useState(DEFAULT_RATIO);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;
    // Clips are large files, so each starts downloading about a screen before it arrives.
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        video.preload = "auto";
        approach.disconnect();
      },
      { rootMargin: "100% 100% 100% 100%" },
    );
    const view = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    approach.observe(frame);
    view.observe(frame);
    return () => {
      approach.disconnect();
      view.disconnect();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      data-gallery-reveal
      data-gallery-snap
      className="relative w-full shrink-0 overflow-hidden md:h-[82svh] md:w-auto"
      style={{ aspectRatio: String(ratio) }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        data-gallery-photo
        onLoadedMetadata={(event) => {
          const { videoWidth, videoHeight } = event.currentTarget;
          if (videoWidth && videoHeight) setRatio(videoWidth / videoHeight);
        }}
        onLoadedData={(event) => {
          event.currentTarget.dataset.loaded = "";
        }}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
