import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

/** The picture shown when the site is shared (WhatsApp, Instagram, Facebook, iMessage…). */
export const alt = `${SITE_NAME} — wedding photography`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Three portfolio covers, pre-shrunk copies kept beside the source so the build stays fast. */
const PHOTOS = ["nabeihazuberwedding", "annushka-karan", "sharanyavinay"];

export default async function Image() {
  const root = process.cwd();
  const [logoFont, subFont, ...photos] = await Promise.all([
    readFile(
      join(root, "public/fonts/forma-djr-micro/forma-djr-micro-bold.otf"),
    ),
    readFile(
      join(root, "public/fonts/forma-djr-banner/forma-djr-banner-regular.otf"),
    ),
    ...PHOTOS.map((name) =>
      readFile(join(root, `src/assets/og/${name}.jpg`), "base64"),
    ),
  ]);

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#0A0A0A",
      }}
    >
      {photos.map((photo, i) => (
        <img
          key={i}
          src={`data:image/jpeg;base64,${photo}`}
          alt=""
          width={400}
          height={630}
          style={{ objectFit: "cover" }}
        />
      ))}
      <div
        style={{
          // The image renderer has no `inset` shorthand, so pin all four edges explicitly.
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.55) 100%)",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            fontFamily: "Logo",
            fontSize: 80,
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          GAUTAM KHULLAR
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: "LogoSub",
            fontSize: 24,
            letterSpacing: "0.42em",
            paddingLeft: "0.42em",
          }}
        >
          PHOTOGRAPHY
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Logo", data: logoFont, weight: 700, style: "normal" },
        { name: "LogoSub", data: subFont, weight: 400, style: "normal" },
      ],
    },
  );
}
