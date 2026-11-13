import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { viewport };

/**
 * Force black square + white GKP mark on /studio.
 * Site icons live under `(site)/` so they no longer leak a white favicon here.
 */
export const metadata: Metadata = {
  ...studioMetadata,
  icons: {
    icon: [
      {
        url: "/images/gk-logo/favicon-studio.ico?v=2",
        type: "image/x-icon",
        sizes: "32x32",
      },
      {
        url: "/images/gk-logo/favicon-studio.png?v=2",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/images/gk-logo/favicon-studio.ico?v=2",
  },
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
