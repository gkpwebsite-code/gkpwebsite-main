import { defineQuery } from "next-sanity";

/** Every published couple, light fields for the portfolio grid and places list. */
export const COUPLES_QUERY = defineQuery(`
  *[_type == "couple" && defined(slug.current)] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    venue,
    city,
    order,
    categories,
    cover,
    covers,
    clips[]{ asset->{ url, originalFilename, mimeType, size } },
    images
  }
`);

/** One couple by slug, including the full gallery for the story page. */
export const COUPLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "couple" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    venue,
    city,
    order,
    categories,
    cover,
    covers,
    clips[]{ asset->{ url, originalFilename, mimeType, size } },
    images
  }
`);

export const COUPLE_SLUGS_QUERY = defineQuery(`
  *[_type == "couple" && defined(slug.current)].slug.current
`);
