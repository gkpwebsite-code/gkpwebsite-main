import localFont from "next/font/local";

const title = localFont({
  src: "../../public/fonts/schneidler-initials/schneidler-initials-regular.ttf",
  variable: "--font-title",
  weight: "400",
  display: "swap",
});

const body = localFont({
  src: [
    {
      path: "../../public/fonts/sweet-sans-pro/sweet-sans-pro-thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/sweet-sans-pro/sweet-sans-pro-extralight.otf",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

const script = localFont({
  src: "../../public/fonts/collingethon/collingethon-regular.ttf",
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

const logo = localFont({
  src: "../../public/fonts/forma-djr-micro/forma-djr-micro-bold.otf",
  variable: "--font-logo",
  weight: "700",
  display: "swap",
});

const logoSub = localFont({
  src: "../../public/fonts/forma-djr-banner/forma-djr-banner-regular.otf",
  variable: "--font-logo-sub",
  weight: "400",
  display: "swap",
});

const caption = localFont({
  src: "../../public/fonts/rexton/rexton-regular.ttf",
  variable: "--font-caption",
  weight: "400",
  display: "swap",
});

export const fontVariables = [
  caption.variable,
  title.variable,
  body.variable,
  script.variable,
  logo.variable,
  logoSub.variable,
].join(" ");
