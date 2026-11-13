import CookieConsent from "@/components/layout/CookieConsent";
import Intro from "@/components/layout/Intro";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import SiteFooter from "@/components/layout/SiteFooter";
import SmoothScroll from "@/components/layout/SmoothScroll";

/** Public site chrome — not applied to `/studio`. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <Intro />
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <CookieConsent />
    </>
  );
}
