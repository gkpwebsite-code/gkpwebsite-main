import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GalleryView from "@/components/pages/GalleryPage/GalleryView";
import { GALLERIES, getGallery } from "@/lib/constants";

export function generateStaticParams() {
  return GALLERIES.map((gallery) => ({ slug: gallery.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const gallery = getGallery(slug);
  if (!gallery) return {};

  return {
    title: gallery.title,
    description: gallery.subtitle,
    openGraph: { images: [gallery.cover] },
  };
}

export default async function Page({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const gallery = getGallery(slug);
  if (!gallery) notFound();

  return <GalleryView gallery={gallery} />;
}
