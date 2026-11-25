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
    placeBackground,
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
    placeBackground,
    order,
    categories,
    cover,
    covers,
    clips[]{ asset->{ url, originalFilename, mimeType, size } },
    images
  }
`);

/** The About page's chosen photos, with sizes so the page can tell portrait from landscape. */
export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_id == "aboutPage"][0] {
    "heroImages": heroImages[]{ asset, crop, hotspot, "dimensions": asset->metadata.dimensions{ width, height } },
    "reelImages": reelImages[]{ asset, crop, hotspot, "dimensions": asset->metadata.dimensions{ width, height } }
  }
`);

/** Contact details and social links (footer, menu, inquiry page). */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0] { email, phone, basedIn, availability, socialLinks[]{ name, url } }
`);

/** Testimonials page, with each couple's name, slug and main photo. */
export const TESTIMONIALS_PAGE_QUERY = defineQuery(`
  *[_id == "testimonialsPage"][0] {
    featuredQuote,
    testimonials[]{ quote, body, photo, "couple": couple->{ title, "slug": slug.current, cover } }
  }
`);

/** FAQ questions in their set order. */
export const FAQ_PAGE_QUERY = defineQuery(`
  *[_id == "faqPage"][0] { questions[]{ question, answer } }
`);

export const COUPLE_SLUGS_QUERY = defineQuery(`
  *[_type == "couple" && defined(slug.current)].slug.current
`);
