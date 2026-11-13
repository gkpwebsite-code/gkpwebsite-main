import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StructuredData from "@/components/seo/StructuredData";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { fontVariables } from "@/lib/fonts";
import { INTRO_BOOT_SCRIPT, INTRO_NOSCRIPT_STYLE } from "@/lib/intro";
import { colors } from "@/lib/theme";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: colors.canvas,
};

/** Shared shell only — site chrome lives in `(site)`, Studio stays clean. */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        <noscript>
          <style>{INTRO_NOSCRIPT_STYLE}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <StructuredData />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
