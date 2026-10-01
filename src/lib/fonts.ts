import localFont from "next/font/local";

const title = localFont({
  src: "../../public/fonts/schneidler-initials/schneidler-initials-regular.woff2",
  variable: "--font-title",
  weight: "400",
  display: "swap",
  preload: false,
});

const body = localFont({
  src: [
    {
      path: "../../public/fonts/sweet-sans-pro/sweet-sans-pro-thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/sweet-sans-pro/sweet-sans-pro-extralight.woff2",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

const script = localFont({
  src: "../../public/fonts/collingethon/collingethon-regular.woff2",
  variable: "--font-script",
  weight: "400",
  display: "swap",
  preload: false,
});

const logo = localFont({
  src: "../../public/fonts/forma-djr-micro/forma-djr-micro-bold.woff2",
  variable: "--font-logo",
  weight: "700",
  display: "swap",
});

const logoSub = localFont({
  src: "../../public/fonts/forma-djr-banner/forma-djr-banner-regular.woff2",
  variable: "--font-logo-sub",
  weight: "400",
  display: "swap",
});

const caption = localFont({
  src: "../../public/fonts/rexton/rexton-regular.woff2",
  variable: "--font-caption",
  weight: "400",
  display: "swap",
  preload: false,
});

const display = localFont({
  src: [
    {
      path: "../../public/fonts/silk-serif/silk-serif-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/silk-serif/silk-serif-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  display.variable,
  caption.variable,
  title.variable,
  body.variable,
  script.variable,
  logo.variable,
  logoSub.variable,
].join(" ");
