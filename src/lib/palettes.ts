/**
 * Palettes for the full-screen menu, compared live via the swatches in the menu so the
 * design can be explored. The first entry is the site's original black and white default.
 */
export type Palette = {
  id: string;
  name: string;
  /** Panel background */
  bg: string;
  /** Type on the panel */
  text: string;
  /** Hovered link */
  accent: string;
};

export const PALETTES: readonly Palette[] = [
  {
    id: "noir",
    name: "Noir (original)",
    bg: "#000000",
    text: "#FFFFFF",
    accent: "#FFFFFF",
  },
  {
    id: "ivory",
    name: "Ivory",
    bg: "#F3EFE7",
    text: "#161412",
    accent: "#8C6A46",
  },
  {
    id: "brass",
    name: "Charcoal & Brass",
    bg: "#2A2826",
    text: "#EDE8DF",
    accent: "#B8955A",
  },
  {
    id: "rosewood",
    name: "Rosewood",
    bg: "#5C3A3A",
    text: "#F3E6DF",
    accent: "#E2BFA8",
  },
  {
    id: "bordeaux",
    name: "Faded Bordeaux",
    bg: "#4A2628",
    text: "#EFE6DA",
    accent: "#C8A97E",
  },
  {
    id: "oxblood",
    name: "Oxblood Velvet",
    bg: "#3E1A1C",
    text: "#F1E5DC",
    accent: "#D2A88A",
  },
  {
    id: "garnet",
    name: "Garnet",
    bg: "#5A1E24",
    text: "#F3E4DC",
    accent: "#D9B07A",
  },
  {
    id: "sindoor",
    name: "Sindoor Dust",
    bg: "#7A3A33",
    text: "#F6E9DF",
    accent: "#EBC9A0",
  },
  {
    id: "brick",
    name: "Brick Rose",
    bg: "#8A4A44",
    text: "#F7ECE4",
    accent: "#F0D2B4",
  },
  {
    id: "clay",
    name: "Terracotta Clay",
    bg: "#7B4A3A",
    text: "#F4E9DC",
    accent: "#EBCDA6",
  },
  {
    id: "sandstone",
    name: "Sandstone",
    bg: "#D9CAB3",
    text: "#3B2A1E",
    accent: "#8A5A3B",
  },
  {
    id: "sage",
    name: "Sage",
    bg: "#5F6A5B",
    text: "#F2EFE6",
    accent: "#DCCBA3",
  },
  {
    id: "mehendi",
    name: "Muted Mehendi",
    bg: "#4A4934",
    text: "#F1ECDD",
    accent: "#D2B67C",
  },
  {
    id: "indigo",
    name: "Dusk Indigo",
    bg: "#262D3B",
    text: "#ECE7DD",
    accent: "#C9B48A",
  },
];

export const PALETTE_STORAGE_KEY = "gkp-menu-palette";

export function applyPalette(palette: Palette) {
  const style = document.documentElement.style;
  style.setProperty("--menu-bg", palette.bg);
  style.setProperty("--menu-text", palette.text);
  style.setProperty("--menu-accent", palette.accent);
}

/**
 * Footer palettes, compared live via the floating swatches beside the footer. "tone" tells the
 * photo-filled wordmark which way to blend so the letters stay clear on light and dark grounds.
 */
export type FooterPalette = {
  id: string;
  name: string;
  bg: string;
  text: string;
  tone: "light" | "dark";
};

export const FOOTER_PALETTES: readonly FooterPalette[] = [
  {
    id: "white",
    name: "White (original)",
    bg: "#FFFFFF",
    text: "#0A0A0A",
    tone: "light",
  },
  { id: "bone", name: "Bone", bg: "#F1ECE3", text: "#1A1714", tone: "light" },
  {
    id: "sandstone",
    name: "Sandstone",
    bg: "#DCCDB6",
    text: "#2E2219",
    tone: "light",
  },
  {
    id: "blush",
    name: "Blush Clay",
    bg: "#E6D3C7",
    text: "#3A2420",
    tone: "light",
  },
  {
    id: "sage",
    name: "Sage Mist",
    bg: "#C9CFC0",
    text: "#232A21",
    tone: "light",
  },
  {
    id: "terracotta",
    name: "Terracotta",
    bg: "#7B4A3A",
    text: "#F4E9DC",
    tone: "dark",
  },
  {
    id: "bordeaux",
    name: "Faded Bordeaux",
    bg: "#4A2628",
    text: "#EFE6DA",
    tone: "dark",
  },
  {
    id: "oxblood",
    name: "Oxblood",
    bg: "#3E1A1C",
    text: "#F1E5DC",
    tone: "dark",
  },
  {
    id: "mehendi",
    name: "Muted Mehendi",
    bg: "#3B3E2E",
    text: "#EEE9DA",
    tone: "dark",
  },
  {
    id: "indigo",
    name: "Dusk Indigo",
    bg: "#232A38",
    text: "#ECE7DD",
    tone: "dark",
  },
  {
    id: "charcoal",
    name: "Charcoal",
    bg: "#1C1B1A",
    text: "#EDE7DD",
    tone: "dark",
  },
  { id: "noir", name: "Noir", bg: "#000000", text: "#FFFFFF", tone: "dark" },
];

export const FOOTER_PALETTE_STORAGE_KEY = "gkp-footer-palette";

export function applyFooterPalette(palette: FooterPalette) {
  const root = document.documentElement;
  root.style.setProperty("--footer-bg", palette.bg);
  root.style.setProperty("--footer-text", palette.text);
  root.dataset.footerTone = palette.tone;
}
