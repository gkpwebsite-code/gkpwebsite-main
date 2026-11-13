import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL, galleryHref } from "@/lib/constants";
import { getGalleries } from "@/lib/galleries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = Object.values(ROUTES).map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly" as const,
    priority: path === ROUTES.HOME ? 1 : 0.8,
  }));

  const galleries = (await getGalleries()).map((gallery) => ({
    url: new URL(galleryHref(gallery.slug), SITE_URL).toString(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...galleries];
}
