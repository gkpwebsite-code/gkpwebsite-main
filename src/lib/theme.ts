/**
 * Design tokens — the single source of truth for colour, type and spacing.
 * Tailwind reads these via tailwind.config.ts; JS reads them via direct import.
 */

export const colors = {
  /** Main site background (light pages, navbar over light sections) */
  canvas: "#FFFFFF",
  /** Text, rules and icons on light sections */
  ink: "#0A0A0A",
  /** Dark band background: footer, gallery bands, full-screen menu */
  night: "#0A0A0A",
  /** Text on dark bands (night) and over hero images */
  paper: "#FFFFFF",
  /** Light alternate section background and image placeholders */
  mist: "#F2F2F2",
  /** Accent: links, active nav, small highlights only */
  accent: "#6B6B6B",
  /** Muted captions, eyebrows, metadata */
  muted: "#8A8A8A",
} as const;

export type ColorName = keyof typeof colors;

export const fontFamily = {
  /** Display serif: hero titles, section headings, logo */
  title: ["var(--font-title)", "Times New Roman", "serif"],
  /** Sans: body copy, nav, buttons, captions */
  body: ["var(--font-body)", "Helvetica Neue", "Arial", "sans-serif"],
  /** Script accent: signatures, small romantic flourishes only */
  script: ["var(--font-script)", "cursive"],
  /** Couple names over portfolio images */
  caption: ["var(--font-caption)", "Helvetica Neue", "Arial", "sans-serif"],
  /** Wordmark name: logo only */
  logo: ["var(--font-logo)", "Helvetica Neue", "Arial", "sans-serif"],
  /** Wordmark subtitle: logo only */
  "logo-sub": ["var(--font-logo-sub)", "Helvetica Neue", "Arial", "sans-serif"],
};

export type FontName = keyof typeof fontFamily;

export const letterSpacing = {
  /** Large display titles */
  tight: "-0.02em",
  /** Buttons and small uppercase labels */
  wide: "0.12em",
  /** Navbar and footer links */
  nav: "0.24em",
  /** Eyebrow text above section titles */
  eyebrow: "0.28em",
};

/** Easing shared by every reveal, hero and hover transition. */
export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Reference scale for headings and copy; mirrors the Tailwind classes used. */
export const typeScale = {
  hero: "text-6xl md:text-8xl lg:text-9xl",
  h1: "text-5xl md:text-7xl",
  h2: "text-4xl md:text-5xl",
  h3: "text-2xl md:text-3xl",
  body: "text-base md:text-lg",
  caption: "text-xs",
  eyebrow: "text-[0.6875rem]",
} as const;

/** Reference spacing rhythm for sections and gutters. */
export const space = {
  sectionY: "py-24 md:py-36",
  gutterX: "px-5 md:px-10",
  maxWidth: "max-w-[92rem]",
} as const;
