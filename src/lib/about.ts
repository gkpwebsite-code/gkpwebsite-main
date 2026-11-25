import type { Gallery } from "@/lib/constants";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";

/** One About-page photograph, sized so the page can tell portrait from landscape. */
export type AboutFrame = {
  src: string;
  width: number;
  height: number;
  /** Focal point (from the Sanity hotspot) kept in frame when the photo is cropped. */
  position?: string;
};

export type AboutPhotos = {
  /** Behind the “About us.” title. Fixed list from Sanity, or random landscapes. */
  hero: AboutFrame[];
  /** Full-screen photographs after “Our approach” (landscape only). From Sanity, or empty → random. */
  reel: AboutFrame[];
  /** Random fallback for the reel: each couple's landscape photos, one list per couple. */
  couples: AboutFrame[][];
  /** Whether hero/reel came from Sanity (shown in that order) or should be shuffled. */
  heroChosen: boolean;
  reelChosen: boolean;
};

type SanityAboutImage = {
  asset?: { _ref?: string };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  hotspot?: { x?: number; y?: number };
  dimensions?: { width?: number; height?: number } | null;
};

type SanityAboutPage = {
  heroImages?: SanityAboutImage[] | null;
  reelImages?: SanityAboutImage[] | null;
} | null;

/** Wider than this counts as landscape: those fill a desktop screen without heavy cropping. */
const LANDSCAPE = 1.05;

/** Full-resolution Sanity URL (cropped if a crop is set); Next resizes it per screen. */
function toFrame(image: SanityAboutImage): AboutFrame | null {
  if (
    !image.asset?._ref ||
    !image.dimensions?.width ||
    !image.dimensions.height
  )
    return null;
  const crop = image.crop ?? {};
  const width =
    image.dimensions.width * (1 - (crop.left ?? 0) - (crop.right ?? 0));
  const height =
    image.dimensions.height * (1 - (crop.top ?? 0) - (crop.bottom ?? 0));
  const { x, y } = image.hotspot ?? {};
  return {
    src: urlForImage(image).quality(90).auto("format").url(),
    width: Math.round(width),
    height: Math.round(height),
    position:
      x !== undefined && y !== undefined
        ? `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`
        : undefined,
  };
}

/**
 * Sanity covers are fetched capped at 1600px for the portfolio tiles; the About page shows
 * them full-screen, so ask for the original and let Next size it for the screen.
 */
function fullSize(src: string) {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const url = new URL(src);
  url.searchParams.delete("w");
  return url.toString();
}

export async function getAboutPhotos(
  galleries: readonly Gallery[],
): Promise<AboutPhotos> {
  let doc: SanityAboutPage = null;
  if (isSanityConfigured) {
    try {
      doc = await client.fetch<SanityAboutPage>(ABOUT_PAGE_QUERY);
    } catch {
      doc = null;
    }
  }

  const chosen = (images?: SanityAboutImage[] | null) =>
    (images ?? [])
      .map(toFrame)
      .filter((frame): frame is AboutFrame => Boolean(frame))
      .slice(0, 5);

  const isLandscape = ({ width, height }: { width: number; height: number }) =>
    width > height * LANDSCAPE;

  const heroChosen = chosen(doc?.heroImages);
  // Studio already refuses portrait photos here; this keeps any stragglers off the page.
  const reelChosen = chosen(doc?.reelImages).filter(isLandscape);

  // Each couple's landscape gallery photos, one list per couple.
  const couples: AboutFrame[][] = galleries
    .map((gallery) =>
      gallery.images.filter(isLandscape).map(({ src, width, height }) => ({
        src: fullSize(src),
        width,
        height,
      })),
    )
    .filter((photos) => photos.length > 0);
  const landscapes = couples.flat();

  // Last resort for the opening if no couple has a landscape yet: their portrait covers.
  const covers: AboutFrame[] = galleries.map((gallery) => ({
    src: fullSize(gallery.cover),
    width: 3,
    height: 4,
  }));

  return {
    hero:
      heroChosen.length > 0
        ? heroChosen
        : landscapes.length > 0
          ? landscapes
          : covers,
    reel: reelChosen,
    couples,
    heroChosen: heroChosen.length > 0,
    reelChosen: reelChosen.length > 0,
  };
}
