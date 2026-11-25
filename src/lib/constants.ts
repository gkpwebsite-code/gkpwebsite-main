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

/** Studio contact details shown in the footer and inquiry flow. */
export const CONTACT_DETAILS = {
  email: "inquiries@gautamkhullarphotography.com",
  phone: "+91 99109 97336",
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
  /**
   * Optional landscape still for desktop hover on “Where we’ve been”.
   * Mobile overlay stays black (no hover).
   */
  placeBackground?: string;
  cover: string;
  /**
   * 3–4 still covers for the portfolio tile. When omitted, uses `cover` plus portraits from
   * `rotation` or the gallery. Shuffled with any clips on each page load.
   */
  covers?: readonly string[];
  /** Extra portraits used when `covers` is not set; defaults to the gallery's first few. */
  rotation?: readonly string[];
  /**
   * Optional short clips (only some couples have these). Mixed into the same cover rotation
   * as the stills — never required, just another frame in the shuffle.
   */
  clips?: readonly string[];
  images: readonly GalleryImage[];
  categories: readonly CategoryId[];
};

const COVERS = "/images/cover-Portfolio-Images";
const WEDDINGS = "/images/couples-wedding-folder";
const CLIPS = "/videoClips";

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
    city: "Jaipur",
    placeBackground: `${WEDDINGS}/sharon-ishan/12.jpg`,
    cover: `${COVERS}/sharonIshan.jpg`,
    // Four strongest stills for the portfolio tile; full gallery keeps the rest.
    covers: [
      `${WEDDINGS}/sharon-ishan/24.jpg`,
      `${WEDDINGS}/sharon-ishan/20.jpg`,
      `${WEDDINGS}/sharon-ishan/3.jpg`,
      `${WEDDINGS}/sharon-ishan/14.jpg`,
    ],
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
    city: "Lake Como",
    cover: `${COVERS}/SofiaHarshil.jpg`,
    // Only one still cover until the gallery folder is filled; both clips are in the shuffle.
    covers: [`${COVERS}/SofiaHarshil.jpg`],
    clips: [`${CLIPS}/SofiyaHarshil.mp4`, `${CLIPS}/SofiyaHarshil2.mp4`],
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "sharanya-vinay",
    title: "Sharanya & Vinay",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "Udaipur",
    cover: `${COVERS}/sharanyavinay.jpg`,
    covers: [`${COVERS}/sharanyavinay.jpg`],
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "nabeiha-zuber",
    title: "Nabeiha & Zuber",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "Jodhpur",
    cover: `${COVERS}/nabeihazuberwedding.jpg`,
    covers: [`${COVERS}/nabeihazuberwedding.jpg`],
    clips: [`${CLIPS}/nahibaZuber.mp4`, `${CLIPS}/nahibaZuber2.mp4`],
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "shivanee-rajat",
    title: "Shivanee & Rajat",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "Goa",
    cover: `${COVERS}/shivaneerajat.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "inayat-jasdeep",
    title: "Inayat & Jasdeep",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "New Delhi",
    cover: `${COVERS}/inayatjasdeep.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "sanjana-shrey",
    title: "Sanjana & Shrey",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "Mussoorie",
    cover: `${COVERS}/sanjana-shrey.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "sarika-zach",
    title: "Sarika & Zach",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "Tuscany",
    cover: `${COVERS}/sarika-zach.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "hunar-noor",
    title: "Hunar & Noor",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "Jaipur",
    cover: `${COVERS}/hunar-noor.jpg`,
    images: [],
    categories: ["couples"],
  },
  {
    slug: "saachi-jay",
    title: "Saachi & Jay",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "London",
    cover: `${COVERS}/saachi-jay.jpg`,
    images: [],
    categories: ["couples", "black-white"],
  },
  {
    slug: "nikita-abhinav",
    title: "Nikita & Abhinav",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "Udaipur",
    cover: `${COVERS}/nikita-abhinav.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
  {
    slug: "annushka-karan",
    title: "Annushka & Karan",
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: "Bali",
    cover: `${COVERS}/annushka-karan.jpg`,
    images: [],
    categories: ["weddings", "couples"],
  },
];

export type CoverFrame =
  { kind: "image"; src: string } | { kind: "video"; src: string };

/** Up to four stills, plus any clips — the pool the tile shuffles through on each visit. */
export function coverPool(gallery: Gallery): CoverFrame[] {
  const stills = (
    gallery.covers ?? [
      gallery.cover,
      ...(gallery.rotation ??
        gallery.images
          .filter(({ width, height }) => height > width)
          .map(({ src }) => src)),
    ]
  )
    .filter((src, index, list) => list.indexOf(src) === index)
    .slice(0, 4);

  return [
    ...stills.map((src) => ({ kind: "image" as const, src })),
    ...(gallery.clips ?? []).map((src) => ({ kind: "video" as const, src })),
  ];
}

/** Fresh random order for this page load. Safe to call only in the browser. */
export function shuffleCoverFrames(
  frames: readonly CoverFrame[],
): CoverFrame[] {
  const next = [...frames];
  for (let index = next.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

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
