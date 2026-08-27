import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
