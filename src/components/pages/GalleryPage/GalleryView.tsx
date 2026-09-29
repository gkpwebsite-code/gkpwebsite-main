import PagePlaceholder from "@/components/sections/PagePlaceholder/PagePlaceholder";
import type { Gallery } from "@/lib/constants";

export default function GalleryView({ gallery }: { gallery: Gallery }) {
  return <PagePlaceholder eyebrow={gallery.subtitle} title={gallery.title} />;
}
