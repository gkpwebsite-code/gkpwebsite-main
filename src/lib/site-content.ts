import { cache } from "react";
import { galleryHref, GALLERIES } from "@/lib/constants";
import { FAQ } from "@/lib/faq";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings";
import { FEATURED_QUOTE, TESTIMONIALS } from "@/lib/testimonials";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import {
  FAQ_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  TESTIMONIALS_PAGE_QUERY,
} from "@/sanity/lib/queries";

/*
 * Content edited in Sanity, each with the site's built-in text as a fallback: until a field is
 * filled in (or if Sanity can't be reached) the page shows exactly what it showed before.
 */

async function fetchOrNull<T>(query: string): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await client.fetch<T>(query);
  } catch {
    return null;
  }
}

/** Keeps the fallback when Sanity's value is missing or blank. */
const pick = (value: string | null | undefined, fallback: string) =>
  value?.trim() ? value.trim() : fallback;

/* ------------------------------ Contact & social ----------------------------- */

type SanitySiteSettings = {
  email?: string | null;
  phone?: string | null;
  basedIn?: string | null;
  availability?: string | null;
  socialLinks?: { name?: string | null; url?: string | null }[] | null;
};

/** Cached per request, so the layout, footer and pages share one fetch. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const doc = await fetchOrNull<SanitySiteSettings>(SITE_SETTINGS_QUERY);
  if (!doc) return DEFAULT_SITE_SETTINGS;
  const socialLinks = (doc.socialLinks ?? [])
    .filter((link) => link.name?.trim() && link.url?.trim())
    .map((link) => ({ name: link.name!.trim(), href: link.url!.trim() }));
  return {
    email: pick(doc.email, DEFAULT_SITE_SETTINGS.email),
    phone: pick(doc.phone, DEFAULT_SITE_SETTINGS.phone),
    basedIn: pick(doc.basedIn, DEFAULT_SITE_SETTINGS.basedIn),
    availability: pick(doc.availability, DEFAULT_SITE_SETTINGS.availability),
    socialLinks:
      socialLinks.length > 0 ? socialLinks : DEFAULT_SITE_SETTINGS.socialLinks,
  };
});

/* -------------------------------- Testimonials ------------------------------- */

export type TestimonialEntry = {
  name: string;
  quote: string;
  body: string;
  photo: string;
  href: string;
};

export type TestimonialsContent = {
  featuredQuote: string;
  testimonials: TestimonialEntry[];
};

type SanityImageRef = { asset?: { _ref?: string } } | null;

type SanityTestimonialsPage = {
  featuredQuote?: string | null;
  testimonials?:
    | {
        quote?: string | null;
        body?: string | null;
        photo?: SanityImageRef;
        couple?: {
          title?: string | null;
          slug?: string | null;
          cover?: SanityImageRef;
        } | null;
      }[]
    | null;
};

const imageUrl = (image: SanityImageRef) =>
  image?.asset?._ref
    ? urlForImage(image).width(2000).quality(90).auto("format").url()
    : null;

function fallbackTestimonials(): TestimonialEntry[] {
  return TESTIMONIALS.flatMap((testimonial) => {
    const gallery = GALLERIES.find((g) => g.slug === testimonial.slug);
    if (!gallery) return [];
    return [
      {
        name: gallery.title,
        quote: testimonial.quote,
        body: testimonial.body,
        photo: gallery.cover,
        href: galleryHref(gallery.slug),
      },
    ];
  });
}

export async function getTestimonials(): Promise<TestimonialsContent> {
  const doc = await fetchOrNull<SanityTestimonialsPage>(
    TESTIMONIALS_PAGE_QUERY,
  );
  const fromSanity = (doc?.testimonials ?? []).flatMap((item) => {
    const couple = item.couple;
    const photo =
      imageUrl(item.photo ?? null) ?? imageUrl(couple?.cover ?? null);
    if (!couple?.title || !couple.slug || !item.quote || !item.body || !photo)
      return [];
    return [
      {
        name: couple.title,
        quote: item.quote,
        body: item.body,
        photo,
        href: galleryHref(couple.slug),
      },
    ];
  });

  return {
    featuredQuote: pick(doc?.featuredQuote, FEATURED_QUOTE),
    testimonials: fromSanity.length > 0 ? fromSanity : fallbackTestimonials(),
  };
}

/* ------------------------------------ FAQ ----------------------------------- */

export type FaqEntry = { question: string; answer: string };

type SanityFaqPage = {
  questions?: { question?: string | null; answer?: string | null }[] | null;
};

export async function getFaq(): Promise<FaqEntry[]> {
  const doc = await fetchOrNull<SanityFaqPage>(FAQ_PAGE_QUERY);
  const fromSanity = (doc?.questions ?? []).flatMap((item) =>
    item.question?.trim() && item.answer?.trim()
      ? [{ question: item.question.trim(), answer: item.answer.trim() }]
      : [],
  );
  return fromSanity.length > 0
    ? fromSanity
    : FAQ.map(({ question, answer }) => ({ question, answer }));
}
