import type { CategoryId, Gallery, GalleryImage } from "@/lib/constants";
import { dataset, projectId } from "../env";
import { urlForImage } from "./image";

type SanityImage = {
  asset?: { _ref?: string; _id?: string };
  hotspot?: unknown;
  crop?: unknown;
};

type SanityClip = {
  asset?: { url?: string | null } | null;
};

export type SanityCouple = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  venue?: string | null;
  city?: string | null;
  order?: number | null;
  categories?: string[] | null;
  cover?: SanityImage | null;
  covers?: SanityImage[] | null;
  clips?: SanityClip[] | null;
  images?: SanityImage[] | null;
};

function imageSrc(image: SanityImage | null | undefined, width = 1600) {
  if (!image?.asset) return null;
  try {
    return urlForImage(image).width(width).quality(90).auto("format").url();
  } catch {
    return null;
  }
}

function galleryImage(image: SanityImage): GalleryImage | null {
  if (!image?.asset) return null;
  try {
    // Ask Sanity for intrinsic size metadata via the builder's URL; dimensions
    // come from the asset id pattern when available, otherwise a portrait default.
    const src = urlForImage(image).quality(90).auto("format").url();
    const ref = image.asset._ref || image.asset._id || "";
    const match = /-(\d+)x(\d+)-/.exec(ref);
    return {
      src,
      width: match ? Number(match[1]) : 2700,
      height: match ? Number(match[2]) : 3600,
    };
  } catch {
    return null;
  }
}

function fileUrl(clip: SanityClip) {
  return clip.asset?.url ?? null;
}

/** Turns a Sanity couple document into the Gallery shape the site already uses. */
export function mapCouple(doc: SanityCouple): Gallery | null {
  if (!doc.slug || !doc.title) return null;
  const cover = imageSrc(doc.cover, 2000);
  if (!cover) return null;

  const covers = (doc.covers ?? [])
    .map((image) => imageSrc(image, 1600))
    .filter((src): src is string => Boolean(src));

  const clips = (doc.clips ?? [])
    .map(fileUrl)
    .filter((src): src is string => Boolean(src));

  const images = (doc.images ?? [])
    .map(galleryImage)
    .filter((image): image is GalleryImage => Boolean(image));

  const categories = (doc.categories ?? []).filter((id): id is CategoryId =>
    [
      "weddings",
      "couples",
      "bride",
      "groom",
      "details",
      "black-white",
      "destination",
    ].includes(id),
  );

  return {
    slug: doc.slug,
    title: doc.title,
    subtitle: doc.subtitle || "The Wedding of",
    venue: doc.venue || "Venue Name",
    city: doc.city || "City",
    cover,
    covers: covers.length > 0 ? covers : [cover],
    clips: clips.length > 0 ? clips : undefined,
    images,
    categories,
  };
}

/** Sanity file CDN base — useful if a clip asset only exposes an id. */
export function sanityFileBase() {
  return `https://cdn.sanity.io/files/${projectId}/${dataset}`;
}
