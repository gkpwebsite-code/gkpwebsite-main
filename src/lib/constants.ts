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
  TESTIMONIALS: "/testimonials",
  CONTACT: "/inquire",
  FAQ: "/faq",
  PRIVACY: "/privacy-policy",
  TERMS: "/terms",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/* ---------------------------------- Links --------------------------------- */

export type NavLink = { label: string; href: Route };

/** Full-screen menu; the portfolio is the home page. */
export const MENU_LINKS: readonly NavLink[] = [
  { label: "Portfolio", href: ROUTES.HOME },
  { label: "About Us", href: ROUTES.ABOUT },
  { label: "Testimonials", href: ROUTES.TESTIMONIALS },
];

export const LEGAL_LINKS: readonly NavLink[] = [
  { label: "Privacy Policy", href: ROUTES.PRIVACY },
  { label: "Terms & Conditions", href: ROUTES.TERMS },
];

/** Footer page links. */
export const FOOTER_LINKS: readonly NavLink[] = [
  { label: "Portfolio", href: ROUTES.HOME },
  { label: "About Us", href: ROUTES.ABOUT },
  { label: "Testimonials", href: ROUTES.TESTIMONIALS },
  { label: "FAQ", href: ROUTES.FAQ },
];

/** Email and phone are placeholders until the studio's real details are confirmed. */
export const CONTACT_DETAILS = {
  email: "hello@yourdomain.com",
  phone: "+91 00000 00000",
  city: "India",
} as const;

export const WEBSITE_CREDIT = {
  name: "BYMOTIFSTUDIOS",
  href: "https://www.instagram.com/bymotifstudios/",
} as const;

export type SocialLink = { name: string; href: string };

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "Facebook", href: "https://www.facebook.com/" },
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
  venue: string;
  city: string;
  cover: string;
  images: readonly GalleryImage[];
  categories: readonly CategoryId[];
};

const COVERS = "/images/cover-Portfolio-Images";
const WEDDINGS = "/images/couples-wedding-folder";

/** Builds a gallery's image list from filenames in its folder; all 2700×3600 unless listed as landscape. */
function galleryImages(
  slug: string,
  files: readonly string[],
  landscape: readonly string[] = [],
): GalleryImage[] {
  return files.map((file) => {
    const wide = landscape.includes(file);
    return {
      src: `${WEDDINGS}/${slug}/${file}`,
      width: wide ? 3600 : 2700,
      height: wide ? 2700 : 3600,
    };
  });
}

/** Portfolio stories. Image filenames carry their size, e.g. "01_2500x3752.jpg". */
export const GALLERIES: readonly Gallery[] = [
  {
    slug: "sharon-ishan",
    title: "Sharon & Ishan",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "City",
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
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "City",
    cover: `${COVERS}/SofiaHarshil.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "sharanya-vinay",
    title: "Sharanya & Vinay",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "City",
    cover: `${COVERS}/sharanyavinay.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "nabeiha-zuber",
    title: "Nabeiha & Zuber",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "City",
    cover: `${COVERS}/nabeihazuberwedding.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "shivanee-rajat",
    title: "Shivanee & Rajat",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "City",
    cover: `${COVERS}/shivaneerajat.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "inayat-jasdeep",
    title: "Inayat & Jasdeep",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "City",
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
