import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GalleryView from "@/components/pages/GalleryPage/GalleryView";
import {
  galleryHref,
  SITE_NAME,
  SITE_URL,
  type Gallery,
} from "@/lib/constants";
import {
  getGalleries,
  getGalleryBySlug,
  getGallerySlugs,
} from "@/lib/galleries";

export async function generateStaticParams() {
  const slugs = await getGallerySlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

/** Placeholder text left in Sanity until the real details are filled in. */
const PLACEHOLDERS = new Set(["venue name", "city", ""]);
const real = (value?: string) =>
  value && !PLACEHOLDERS.has(value.trim().toLowerCase())
    ? value.trim()
    : undefined;

/** "Villa Balbiano, Lake Como" — whichever of the two are really filled in. */
function placeOf(gallery: Gallery) {
  return [real(gallery.venue), real(gallery.city)].filter(Boolean).join(", ");
}

function describe(gallery: Gallery) {
  const place = placeOf(gallery);
  return `The wedding of ${gallery.title}${place ? ` at ${place}` : ""}, photographed by ${SITE_NAME}.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) return {};

  return {
    title: gallery.title,
    description: describe(gallery),
    alternates: { canonical: galleryHref(gallery.slug) },
    openGraph: { images: [gallery.cover] },
  };
}

/**
 * Tells search engines what this page is: a photo gallery of one wedding, where it happened and
 * who photographed it, with its photographs, so it can surface for searches like
 * "wedding photographer Udaipur".
 */
function galleryStructuredData(gallery: Gallery) {
  const url = new URL(galleryHref(gallery.slug), SITE_URL).toString();
  const venue = real(gallery.venue);
  const city = real(gallery.city);
  const photos = [gallery.cover, ...gallery.images.map(({ src }) => src)].slice(
    0,
    20,
  );
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${gallery.subtitle} ${gallery.title}`,
    description: describe(gallery),
    url,
    image: photos,
    ...(venue || city
      ? {
          contentLocation: {
            "@type": "Place",
            name: venue ?? city,
            ...(city
              ? { address: { "@type": "PostalAddress", addressLocality: city } }
              : {}),
          },
        }
      : {}),
    author: {
      "@type": "ProfessionalService",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [gallery, galleries] = await Promise.all([
    getGalleryBySlug(slug),
    getGalleries(),
  ]);
  if (!gallery) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(galleryStructuredData(gallery)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <GalleryView gallery={gallery} galleries={galleries} />
    </>
  );
}
