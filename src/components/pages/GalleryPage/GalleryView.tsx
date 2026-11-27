"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ROUTES, type Gallery, type GalleryImage } from "@/lib/constants";
import { allowHorizontalGestures, useLenis } from "@/lib/lenis";
import { SIDE_LABEL } from "@/lib/sideLabel";
import { previousPathname } from "@/lib/visit-history";
import { cn } from "@/lib/utils";
import GalleryClip from "./GalleryClip";
import GalleryFlipIntro, { COVER_SIZES } from "./GalleryFlipIntro";
import GalleryLightbox from "./GalleryLightbox";
import NextWedding from "./NextWedding";

/** Seconds of no scrolling, swiping or key presses before the gallery starts drifting on its own. */
const AUTOSCROLL_IDLE_MS = 5000;
/** Auto-scroll drift speed in pixels per second. */
const AUTOSCROLL_SPEED = 60;
/** Time for auto-scroll to ease up to full speed so it never lurches into motion. */
const AUTOSCROLL_RAMP_MS = 1200;

const INTERACTION_EVENTS = [
  "wheel",
  "touchstart",
  "touchmove",
  "pointerdown",
  "keydown",
] as const;

/** Matches Tailwind's `md`: sideways gallery from here up, a plain vertical scroll below. */
const DESKTOP_QUERY = "(min-width: 48rem)";

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
}

const imageNumber = (index: number) => String(index + 1).padStart(2, "0");

/**
 * How wide each photo really renders, so the browser fetches no more pixels than the screen
 * shows (sharp on high-density screens, never oversized). Desktop: the strip is 82% of the
 * screen height tall, so width follows the photo's shape; phones: full width.
 */
function imageSizes({ width, height }: GalleryImage) {
  return `(min-width: 768px) calc(82vh * ${(width / height).toFixed(3)}), 100vw`;
}

/** One item in the gallery strip: a photograph (with its place among the photos) or a film clip. */
type StripItem =
  | { kind: "photo"; image: GalleryImage; photoIndex: number }
  | { kind: "clip"; src: string };

/**
 * Photos in order, with any film clips spread evenly through the story rather than bunched at
 * the start or end (two clips land about a third and two thirds of the way in).
 */
function buildStrip(
  images: readonly GalleryImage[],
  clips: readonly string[],
): StripItem[] {
  const items: StripItem[] = images.map((image, photoIndex) => ({
    kind: "photo",
    image,
    photoIndex,
  }));
  clips.forEach((src, index) => {
    const after = Math.round(
      ((index + 1) * images.length) / (clips.length + 1),
    );
    // Each earlier clip already shifted later positions along by one.
    items.splice(after + index, 0, { kind: "clip", src });
  });
  return items;
}

/** Photos loaded straight away; the rest follow one after another in the background. */
const EAGER_PHOTOS = 3;

export default function GalleryView({
  gallery,
  galleries,
}: {
  gallery: Gallery;
  galleries: readonly Gallery[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const shownRef = useRef(0);
  const lenis = useLenis();
  const isDesktop = useIsDesktop();
  const [lightboxAt, setLightboxAt] = useState<number | null>(null);
  const [strip] = useState(() =>
    buildStrip(gallery.images, gallery.clips ?? []),
  );
  /** The photo to open in the viewer for a strip position (a clip opens the photo after it). */
  const photoAt = (stripIndex: number) => {
    const rest = strip.slice(stripIndex);
    const ahead = rest.find((item) => item.kind === "photo");
    const behind = [...strip.slice(0, stripIndex)]
      .reverse()
      .find((item) => item.kind === "photo");
    const item = ahead ?? behind;
    return item?.kind === "photo" ? item.photoIndex : 0;
  };
  // On desktop the strip moves sideways, so photos come into view faster than the browser's
  // own lazy loading reacts. Each photo that finishes loading lets the next one start, so the
  // whole gallery fills in ahead of the visitor, one photo at a time (never all at once).
  const [eagerUntil, setEagerUntil] = useState(EAGER_PHOTOS - 1);
  // The flip-through opening, shown when the gallery is opened directly (see GalleryFlipIntro).
  const [flipping, setFlipping] = useState(false);
  // As the cover starts growing: names rise, side labels slide in, but the page's own cover
  // stays hidden so it never shows twice behind the growing print.
  const revealAfterFlip = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.dataset.flipHold = "";
    section.dataset.entered = "";
  }, []);
  // The print has landed exactly on the cover's spot: show the real cover and drop the print
  // in the same frame, so the swap is invisible.
  const endFlip = useCallback(() => {
    const section = sectionRef.current;
    if (section) {
      section.dataset.flipped = "";
      delete section.dataset.flipHold;
    }
    setFlipping(false);
  }, []);
  const [firstName, secondName] = gallery.title.split(" & ");
  const position = galleries.findIndex(({ slug }) => slug === gallery.slug);
  const nextGallery = galleries[(position + 1) % galleries.length];

  const closeLightbox = useCallback(
    (index: number) => {
      setLightboxAt(null);
      // The viewer counts photos only; find that photo's place in the strip (clips sit between).
      const stripIndex = strip.findIndex(
        (item) => item.kind === "photo" && item.photoIndex === index,
      );
      const photo = stripRef.current?.children[stripIndex];
      if (!photo) return;
      const { top, height } = photo.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + top + height / 2 - window.innerHeight / 2,
        behavior: "instant",
      });
    },
    [strip],
  );

  // Desktop: → and ← glide to the next or previous photograph (the viewer has its own keys).
  useEffect(() => {
    if (!isDesktop || lightboxAt !== null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const typing = (event.target as HTMLElement | null)?.closest(
        "input, textarea, select, [contenteditable]",
      );
      if (typing) return;
      const stops = Array.from(
        sectionRef.current?.querySelectorAll<HTMLElement>(
          "[data-gallery-snap]",
        ) ?? [],
      );
      if (stops.length === 0) return;
      const middle = window.innerWidth / 2;
      const offset = (element: HTMLElement) => {
        const { left, width } = element.getBoundingClientRect();
        return left + width / 2 - middle;
      };
      let current = 0;
      stops.forEach((stop, index) => {
        if (Math.abs(offset(stop)) < Math.abs(offset(stops[current])))
          current = index;
      });
      const target = stops[current + (event.key === "ArrowRight" ? 1 : -1)];
      if (!target) return;
      event.preventDefault();
      // Sideways movement follows the page's vertical scroll one-to-one.
      const from = lenis ? lenis.scroll : window.scrollY;
      if (lenis) lenis.scrollTo(from + offset(target), { duration: 1 });
      else window.scrollTo({ top: from + offset(target), behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDesktop, lightboxAt, lenis]);

  // Phones: tapping a photo opens it in the viewer; tapping the names or cover screen glides on to the next.
  const handleTap = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia(DESKTOP_QUERY).matches) return;
    if ((event.target as HTMLElement).closest("a")) return;
    const item = (event.target as HTMLElement).closest("[data-gallery-reveal]");
    const items = Array.from(stripRef.current?.children ?? []);
    const stripIndex = item ? items.indexOf(item) : -1;
    // Photos open in the viewer; a film clip (or anything else) glides on to the next.
    if (stripIndex >= 0 && strip[stripIndex]?.kind === "photo")
      setLightboxAt(photoAt(stripIndex));
    else showNext();
  };

  // Native smooth scroll rather than Lenis, which would fight the CSS scroll snapping frame by frame.
  const showNext = () => {
    const targets = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>(
        "[data-gallery-snap]",
      ) ?? [],
    );
    const middle = window.innerHeight / 2;
    const offsetFromMiddle = (element: HTMLElement) => {
      const { top, height } = element.getBoundingClientRect();
      return top + height / 2 - middle;
    };
    let current = 0;
    targets.forEach((target, index) => {
      if (
        Math.abs(offsetFromMiddle(target)) <
        Math.abs(offsetFromMiddle(targets[current]))
      )
        current = index;
    });
    const next = targets[current + 1];
    if (!next) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: window.scrollY + offsetFromMiddle(next),
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    root.dataset.gallery = "";

    let frame = 0;
    const enter = () => {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          section.dataset.entered = "";
        });
      });
    };

    let introObserver: MutationObserver | undefined;
    let flipTimer = 0;
    if ("galleryFlip" in root.dataset) {
      // Opened directly (link or reload): the flip-through-the-prints opening plays first and
      // starts the entrance itself. Flag is single-use, so in-site visits keep the quick reveal.
      // Cleared only when the opening really starts, so a re-run of this effect keeps it.
      flipTimer = window.setTimeout(() => {
        delete root.dataset.galleryFlip;
        setFlipping(true);
      }, 0);
    } else if (root.dataset.intro) {
      enter();
    } else {
      introObserver = new MutationObserver(() => {
        if (!root.dataset.intro) return;
        introObserver?.disconnect();
        enter();
      });
      introObserver.observe(root, { attributeFilter: ["data-intro"] });
    }

    return () => {
      introObserver?.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(flipTimer);
      delete root.dataset.gallery;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const strip = stripRef.current;
    const number = counterRef.current;
    if (!section || !track || !strip || !number) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const photos = Array.from(strip.children as HTMLCollectionOf<HTMLElement>);
    let sectionTop = 0;
    let maxOffset = 0;
    let centers: number[] = [];

    const currentScroll = () => (lenis ? lenis.scroll : window.scrollY);

    const measure = () => {
      if (isDesktop) {
        maxOffset = Math.max(track.scrollWidth - window.innerWidth, 0);
        section.style.height = `${maxOffset + window.innerHeight}px`;
      } else {
        maxOffset = 0;
        section.style.height = "";
        track.style.transform = "";
      }
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      centers = photos.map((photo) =>
        isDesktop
          ? photo.offsetLeft + photo.offsetWidth / 2
          : photo.offsetTop + photo.offsetHeight / 2,
      );
    };

    // The photo whose centre is nearest the middle of the screen is the current one.
    const updateCounter = (middle: number) => {
      let nearest = 0;
      centers.forEach((center, index) => {
        if (Math.abs(center - middle) < Math.abs(centers[nearest] - middle))
          nearest = index;
      });
      if (nearest === shownRef.current) return;
      const forward = nearest > shownRef.current;
      shownRef.current = nearest;
      rollCounter(imageNumber(nearest), forward);
    };

    // Follows the scroll: sideways on desktop (old number out left, new in from the right), upward on phones.
    // Each roll always completes; scrolling on meanwhile makes the next roll jump straight to the latest number.
    // Animates `translate` (not `transform`) so the motion stays in screen space despite the label's rotate-180.
    let rolling = false;
    let pending: { text: string; forward: boolean } | null = null;

    const rollCounter = (text: string, forward: boolean) => {
      if (reducedMotion) {
        number.textContent = text;
        return;
      }
      pending = { text, forward };
      if (!rolling) playRoll();
    };

    const playRoll = async () => {
      if (!pending) return;
      const { text, forward } = pending;
      pending = null;
      if (text === number.textContent) return;
      rolling = true;
      const distance = isDesktop
        ? number.offsetWidth * 0.7
        : number.offsetHeight * 0.6;
      const shift = distance * (forward ? 1 : -1);
      const along = (px: number) => (isDesktop ? `${px}px 0` : `0 ${px}px`);
      try {
        const leave = number.animate(
          [
            { translate: "0 0", opacity: 1 },
            { translate: along(-shift), opacity: 0 },
          ],
          {
            duration: 260,
            easing: "cubic-bezier(0.5, 0, 0.75, 0)",
            fill: "forwards",
          },
        );
        await leave.finished;
        number.textContent = text;
        const arrive = number.animate(
          [
            { translate: along(shift), opacity: 0 },
            { translate: "0 0", opacity: 1 },
          ],
          { duration: 480, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
        );
        leave.cancel();
        await arrive.finished;
      } catch {
        number.textContent = text;
      }
      rolling = false;
      playRoll();
    };

    const render = () => {
      if (isDesktop) {
        const offset = Math.min(
          Math.max(currentScroll() - sectionTop, 0),
          maxOffset,
        );
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        updateCounter(offset + window.innerWidth / 2);
      } else {
        updateCounter(window.scrollY - sectionTop + window.innerHeight / 2);
      }
    };

    measure();
    render();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      render();
    });
    resizeObserver.observe(track);
    window.addEventListener("resize", measure);

    const unsubscribeScroll = isDesktop
      ? lenis?.on("scroll", render)
      : undefined;
    if (!unsubscribeScroll)
      window.addEventListener("scroll", render, { passive: true });

    // Phones: each photo eases in as it scrolls into view.
    const revealObserver = isDesktop
      ? undefined
      : new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              (entry.target as HTMLElement).dataset.inview = "";
              revealObserver?.unobserve(entry.target);
            }),
          { rootMargin: "0px 0px 5% 0px" },
        );
    photos.forEach((photo) => revealObserver?.observe(photo));

    const restoreGestures = isDesktop ? allowHorizontalGestures() : () => {};

    let lastInteraction = performance.now();
    const markInteraction = () => {
      lastInteraction = performance.now();
    };
    if (isDesktop)
      INTERACTION_EVENTS.forEach((type) =>
        window.addEventListener(type, markInteraction, { passive: true }),
      );

    let frame = 0;
    let previous = performance.now();
    let ramp = 0;
    let carry = 0;

    const autoscroll = (now: number) => {
      const elapsed = now - previous;
      previous = now;

      if (
        root.dataset.intro !== "done" ||
        section.dataset.entered === undefined
      ) {
        lastInteraction = now;
      }

      const scroll = currentScroll();
      const inGallery =
        scroll >= sectionTop - 1 && scroll < sectionTop + maxOffset - 1;
      const idle = now - lastInteraction > AUTOSCROLL_IDLE_MS;

      if (!reducedMotion && idle && inGallery) {
        ramp = Math.min(ramp + elapsed / AUTOSCROLL_RAMP_MS, 1);
        const step = ((AUTOSCROLL_SPEED * elapsed) / 1000) * ramp;
        if (lenis) {
          lenis.scrollTo(scroll + step, { immediate: true });
        } else {
          carry += step;
          const whole = Math.floor(carry);
          if (whole > 0) {
            window.scrollBy(0, whole);
            carry -= whole;
          }
        }
      } else {
        ramp = 0;
      }

      frame = requestAnimationFrame(autoscroll);
    };
    if (isDesktop) frame = requestAnimationFrame(autoscroll);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      revealObserver?.disconnect();
      window.removeEventListener("resize", measure);
      unsubscribeScroll?.();
      window.removeEventListener("scroll", render);
      INTERACTION_EVENTS.forEach((type) =>
        window.removeEventListener(type, markInteraction),
      );
      restoreGestures();
    };
  }, [lenis, isDesktop]);

  return (
    <section ref={sectionRef} className="relative bg-canvas text-ink">
      <h1 className="sr-only">{gallery.title}</h1>
      {flipping && (
        <GalleryFlipIntro
          gallery={gallery}
          onReveal={revealAfterFlip}
          onDone={endFlip}
        />
      )}
      <div className="pointer-events-none fixed top-6 left-3 z-50 text-paper mix-blend-difference md:left-5">
        <div data-gallery-edge>
          <Link
            href={ROUTES.HOME}
            onClick={(event) => {
              // Came here from the portfolio grid within this visit: step back through history,
              // so the grid returns at the same spot and order. Otherwise open it fresh.
              const previous = previousPathname();
              if (
                (previous === ROUTES.HOME || previous === ROUTES.PORTFOLIO) &&
                !event.metaKey &&
                !event.ctrlKey &&
                !event.shiftKey
              ) {
                event.preventDefault();
                window.history.back();
              }
            }}
            className={cn(
              SIDE_LABEL,
              "block rotate-180 transition-opacity duration-300 hover:opacity-60 focus-visible:opacity-60",
            )}
          >
            Back
          </Link>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-16 left-3 z-50 text-paper mix-blend-difference md:bottom-12 md:left-5"
      >
        <div data-gallery-edge>
          <span
            ref={counterRef}
            className={cn(
              SIDE_LABEL,
              "pointer-events-none block rotate-180 tabular-nums",
            )}
          >
            {imageNumber(0)}
          </span>
        </div>
      </div>
      {gallery.images.length > 0 && (
        <div className="pointer-events-none fixed bottom-8 left-3 z-50 text-paper mix-blend-difference md:hidden">
          <div data-gallery-edge>
            <button
              type="button"
              onClick={() => setLightboxAt(photoAt(shownRef.current))}
              aria-label="View all photographs"
              className="pointer-events-auto grid size-5 cursor-pointer grid-cols-3 gap-[3px] transition-opacity duration-300 active:opacity-60"
            >
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className="bg-current" />
              ))}
            </button>
          </div>
        </div>
      )}
      <div className="md:sticky md:top-0 md:h-svh md:overflow-hidden">
        <div
          ref={trackRef}
          onClick={handleTap}
          className="flex flex-col md:h-full md:w-max md:flex-row md:items-center md:will-change-transform"
        >
          <div
            data-gallery-snap
            className="relative flex h-svh w-full shrink-0 flex-col items-center justify-center px-8 text-center md:h-full md:w-[50vw]"
          >
            <p
              data-gallery-fade
              style={{ "--i": 0 } as React.CSSProperties}
              className="font-logo-sub text-[0.6875rem] leading-none tracking-[0.15em] uppercase md:text-xs"
            >
              {gallery.subtitle}
            </p>
            <p
              aria-hidden="true"
              className="mt-8 font-display text-6xl leading-[0.95] md:text-7xl lg:text-8xl"
            >
              <span className="-mx-[0.15em] -mt-[0.1em] -mb-[0.32em] block overflow-hidden px-[0.15em] pt-[0.1em] pb-[0.32em]">
                <span
                  data-gallery-line
                  className="block"
                  style={{ "--i": 1 } as React.CSSProperties}
                >
                  {firstName}
                  {secondName && (
                    <span className="ml-3 align-middle text-3xl md:text-4xl">
                      &amp;
                    </span>
                  )}
                </span>
              </span>
              {secondName && (
                <span className="-mx-[0.15em] -mt-[0.1em] -mb-[0.32em] block overflow-hidden px-[0.15em] pt-[0.1em] pb-[0.32em]">
                  <em
                    data-gallery-line
                    className="block italic"
                    style={{ "--i": 2 } as React.CSSProperties}
                  >
                    {secondName}
                  </em>
                </span>
              )}
            </p>
            <div
              aria-hidden="true"
              data-gallery-fade
              style={{ "--i": 4 } as React.CSSProperties}
              className="mt-14 flex flex-col items-center gap-4 md:hidden"
            >
              <span className="font-logo-sub text-[0.625rem] leading-none tracking-[0.2em] uppercase md:text-[0.6875rem]">
                Scroll for more
              </span>
              <span className="relative block h-14 w-px bg-current/20 md:h-16">
                <span
                  data-scroll-cue
                  className="absolute inset-0 [animation:scroll-cue_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-current"
                />
              </span>
            </div>
            {/* Bottom-right corner is CONTACT's on phones, so the location centres there instead. */}
            <p
              data-gallery-fade
              style={{ "--i": 3 } as React.CSSProperties}
              className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-1.5 md:inset-x-auto md:right-10 md:bottom-12 md:items-end"
            >
              <span className="font-logo text-sm leading-none font-bold tracking-[-0.01em] uppercase md:text-base">
                {gallery.venue}
              </span>
              <span className="font-display text-base leading-none italic md:text-lg">
                {gallery.city}
              </span>
            </p>
          </div>

          <div
            data-gallery-snap
            className="relative h-svh w-full shrink-0 overflow-hidden md:h-full md:w-[50vw]"
          >
            <div data-gallery-cover className="absolute inset-0">
              <div className="absolute inset-0">
                <Image
                  src={gallery.cover}
                  alt={gallery.title}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  quality={90}
                  sizes={COVER_SIZES}
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div
            ref={stripRef}
            className="flex flex-col md:h-full md:shrink-0 md:flex-row md:items-center md:gap-[1.5vw] md:px-[4vw]"
          >
            {strip.map((item, stripIndex) => {
              if (item.kind === "clip")
                return (
                  <GalleryClip
                    key={`clip-${item.src}`}
                    src={item.src}
                    poster={gallery.cover}
                    label={`${gallery.title}, film`}
                  />
                );
              const { image, photoIndex: index } = item;
              return (
                <div
                  key={`${stripIndex}-${image.src}`}
                  data-gallery-reveal
                  data-gallery-snap
                  className="relative w-full shrink-0 overflow-hidden md:h-[82svh] md:w-auto"
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                >
                  <Image
                    src={image.src}
                    alt={`${gallery.title}, photograph ${index + 1}`}
                    fill
                    quality={90}
                    sizes={imageSizes(image)}
                    loading={
                      index < EAGER_PHOTOS || (isDesktop && index <= eagerUntil)
                        ? "eager"
                        : "lazy"
                    }
                    fetchPriority={index < EAGER_PHOTOS ? "high" : "auto"}
                    data-gallery-photo
                    onLoad={(event) => {
                      event.currentTarget.dataset.loaded = "";
                      setEagerUntil((current) => Math.max(current, index + 1));
                    }}
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>

          {nextGallery.slug !== gallery.slug && (
            <NextWedding gallery={nextGallery} />
          )}
        </div>
      </div>
      <GalleryLightbox
        images={gallery.images}
        title={gallery.title}
        openAt={lightboxAt}
        onClose={closeLightbox}
      />
    </section>
  );
}
