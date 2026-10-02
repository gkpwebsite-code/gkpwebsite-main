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
