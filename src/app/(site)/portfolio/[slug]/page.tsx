import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GalleryView from "@/components/pages/GalleryPage/GalleryView";
import {
  getGalleries,
  getGalleryBySlug,
  getGallerySlugs,
} from "@/lib/galleries";

export async function generateStaticParams() {
  const slugs = await getGallerySlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) return {};

  return {
    title: gallery.title,
    description: `${gallery.subtitle} ${gallery.title}, ${gallery.venue}, ${gallery.city}.`,
    openGraph: { images: [gallery.cover] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [gallery, galleries] = await Promise.all([
    getGalleryBySlug(slug),
    getGalleries(),
  ]);
  if (!gallery) notFound();

  return <GalleryView gallery={gallery} galleries={galleries} />;
}
