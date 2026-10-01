/* ---------------------------------- Site ---------------------------------- */

export const SITE_NAME = "Gautam Khullar Photography";
export const SITE_SHORT_NAME = "Gautam Khullar";
export const SITE_TAGLINE = "Wedding Photography";
export const SITE_DESCRIPTION =
  "Editorial wedding photography — cinematic storytelling, light, and lasting stories.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* --------------------------------- Routes --------------------------------- */

export const ROUTES = {
  HOME: "/",
  PORTFOLIO: "/portfolio",
  ABOUT: "/about",
  CONTACT: "/inquire",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/* ---------------------------------- Links --------------------------------- */

export type NavLink = { label: string; href: Route };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Portfolio", href: ROUTES.PORTFOLIO },
  { label: "About", href: ROUTES.ABOUT },
  { label: "Inquire", href: ROUTES.CONTACT },
];

/** `icon` is a single SVG path drawn on a 24×24 viewBox with fill-rule evenodd. */
export type SocialLink = { name: string; href: string; icon: string };

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.25-3.3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z",
  },
];

/* --------------------------------- Images --------------------------------- */

/** Full-bleed hero backgrounds, one per page hero. */
export const HERO_IMAGES = {
  /** HomeHero */
  home: "/images/hero/home_2500x1667.jpg",
  /** PortfolioHero */
  portfolio: "/images/hero/portfolio_2500x1667.jpg",
  /** AboutHero */
  about: "/images/hero/about_2500x1667.jpg",
  /** InquireHero */
  inquire: "/images/hero/inquire_2500x1667.jpg",
} as const;

/** Default social share image (metadata openGraph). */
export const OG_IMAGE = "/images/og/default_1200x630.jpg";

/* -------------------------------- Galleries ------------------------------- */

export const CATEGORIES = [
  { id: "weddings", label: "Weddings" },
  { id: "couples", label: "Couples" },
  { id: "bride", label: "Bride" },
  { id: "groom", label: "Groom" },
  { id: "details", label: "Details" },
  { id: "black-white", label: "Black & White" },
  { id: "destination", label: "Destination" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type GalleryImage = { src: string; width: number; height: number };

export type Gallery = {
  slug: string;
  title: string;
  subtitle: string;
  cover: string;
  images: readonly GalleryImage[];
  categories: readonly CategoryId[];
};

const COVERS = "/images/cover-Portfolio-Images";
const WEDDINGS = "/images/couples-wedding-folder";

/** Builds a gallery's image list from filenames in its folder; all 4800×6400 unless listed as landscape. */
function galleryImages(
  slug: string,
  files: readonly string[],
  landscape: readonly string[] = [],
): GalleryImage[] {
  return files.map((file) => {
    const wide = landscape.includes(file);
    return {
      src: `${WEDDINGS}/${slug}/${file}`,
      width: wide ? 6400 : 4800,
      height: wide ? 4800 : 6400,
    };
  });
}

/** Portfolio stories. Image filenames carry their size, e.g. "01_2500x3752.jpg". */
export const GALLERIES: readonly Gallery[] = [
  {
    slug: "sharon-ishan",
    title: "Sharon & Ishan",
    subtitle: "Wedding",
    cover: `${COVERS}/sharonIshan.jpg`,
    images: galleryImages(
      "sharon-ishan",
      [
        "2.jpg",
        "2SH.jpg",
        "3.jpg",
        "3SH.jpg",
        "4SH.jpg",
        "6.jpg",
        "6SH.jpg",
        "8SH.jpg",
        "9SH.jpg",
        "10.jpg",
        "11.jpg",
        "12.jpg",
        "13.jpg",
        "14.jpg",
        "16.jpg",
        "17.jpg",
        "18.jpg",
        "19.jpg",
        "20.jpg",
        "20SH.jpg",
        "21.jpg",
        "22.jpg",
        "22SH.jpg",
        "23.jpg",
        "23SH.jpg",
        "24.jpg",
        "24SH.jpg",
        "25SH.jpg",
        "26SH.jpg",
        "28SH.jpg",
        "29SH.jpg",
        "1118SH.jpg",
        "2111SH.jpg",
      ],
      ["12.jpg", "16.jpg"],
    ),
    categories: ["weddings", "couples"],
  },
  {
    slug: "sofia-harshil",
    title: "Sofia & Harshil",
    subtitle: "Wedding",
    cover: `${COVERS}/SofiaHarshil.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "sharanya-vinay",
    title: "Sharanya & Vinay",
    subtitle: "Wedding",
    cover: `${COVERS}/sharanyavinay.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "nabeiha-zuber",
    title: "Nabeiha & Zuber",
    subtitle: "Wedding",
    cover: `${COVERS}/nabeihazuberwedding.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "shivanee-rajat",
    title: "Shivanee & Rajat",
    subtitle: "Wedding",
    cover: `${COVERS}/shivaneerajat.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "inayat-jasdeep",
    title: "Inayat & Jasdeep",
    subtitle: "Wedding",
    cover: `${COVERS}/inayatjasdeep.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
];

export function galleryHref(slug: string) {
  return `${ROUTES.PORTFOLIO}/${slug}`;
}

export function getGallery(slug: string) {
  return GALLERIES.find((gallery) => gallery.slug === slug);
}

/* --------------------------------- Helpers -------------------------------- */

export type ImageDims = { width: number; height: number };

/** Reads the "_WIDTHxHEIGHT" suffix from a filename so next/image gets the true aspect ratio. */
export function imageDimsFromPath(
  src: string,
  fallback: ImageDims = { width: 2000, height: 1333 },
): ImageDims {
  const match = src.match(/_(\d+)x(\d+)(?=\.[a-z0-9]+$)/i);
  if (!match) return fallback;
  return { width: Number(match[1]), height: Number(match[2]) };
}
