import PortfolioGrid from "@/components/sections/PortfolioGrid/PortfolioGrid";
import { getGalleries } from "@/lib/galleries";

export default async function PortfolioView() {
  const galleries = await getGalleries();
  return (
    <PortfolioGrid
      key={galleries.map((gallery) => gallery.slug).join("|")}
      galleries={galleries}
    />
  );
}
