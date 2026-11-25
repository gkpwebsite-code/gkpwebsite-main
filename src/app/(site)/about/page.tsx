import type { Metadata } from "next";
import AboutView from "@/components/pages/AboutPage/AboutView";
import { getAboutPhotos } from "@/lib/about";
import { getGalleries } from "@/lib/galleries";

export const metadata: Metadata = {
  title: "About",
};

export default async function Page() {
  const photos = await getAboutPhotos(await getGalleries());
  return <AboutView photos={photos} />;
}
