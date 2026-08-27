import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gautam Khullar Photography",
    template: "%s · Gautam Khullar Photography",
  },
  description:
    "Editorial wedding photography — cinematic storytelling, light, and lasting stories.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-body flex min-h-full flex-col bg-[var(--gk-canvas)] text-[var(--gk-ink)]">
        {children}
      </body>
    </html>
  );
}
