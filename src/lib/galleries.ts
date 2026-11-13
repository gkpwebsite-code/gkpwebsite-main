import { GALLERIES, type Gallery } from "@/lib/constants";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { mapCouple, type SanityCouple } from "@/sanity/lib/mapCouple";
import {
  COUPLES_QUERY,
  COUPLE_BY_SLUG_QUERY,
  COUPLE_SLUGS_QUERY,
} from "@/sanity/lib/queries";

/**
 * All couples for the portfolio. Uses Sanity when configured and populated;
 * otherwise falls back to the local `GALLERIES` list so the site keeps working
 * while the CMS is filled in.
 */
export async function getGalleries(): Promise<readonly Gallery[]> {
  if (!isSanityConfigured) return GALLERIES;

  try {
    const docs = await client.fetch<SanityCouple[]>(COUPLES_QUERY);
    const galleries = docs
      .map(mapCouple)
      .filter((gallery): gallery is Gallery => Boolean(gallery));
    return galleries.length > 0 ? galleries : GALLERIES;
  } catch {
    return GALLERIES;
  }
}

export async function getGalleryBySlug(
  slug: string,
): Promise<Gallery | undefined> {
  if (!isSanityConfigured) {
    return GALLERIES.find((gallery) => gallery.slug === slug);
  }

  try {
    const doc = await client.fetch<SanityCouple | null>(COUPLE_BY_SLUG_QUERY, {
      slug,
    });
    const gallery = doc ? mapCouple(doc) : null;
    if (gallery) return gallery;
  } catch {
    // fall through to local
  }

  return GALLERIES.find((gallery) => gallery.slug === slug);
}

export async function getGallerySlugs(): Promise<string[]> {
  if (!isSanityConfigured) return GALLERIES.map((gallery) => gallery.slug);

  try {
    const slugs = await client.fetch<string[]>(COUPLE_SLUGS_QUERY);
    if (slugs.length > 0) return slugs;
  } catch {
    // fall through
  }

  return GALLERIES.map((gallery) => gallery.slug);
}
