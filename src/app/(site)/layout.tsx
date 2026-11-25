import CookieConsent from "@/components/layout/CookieConsent";
import Intro from "@/components/layout/Intro";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteSettingsProvider from "@/components/layout/SiteSettingsProvider";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { getSiteSettings } from "@/lib/site-content";

/** Public site chrome — not applied to `/studio`. */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Contact details and social links from Sanity, shared with the menu, footer and pages.
  const settings = await getSiteSettings();

  return (
    <SiteSettingsProvider settings={settings}>
      <SmoothScroll />
      <Intro />
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <CookieConsent />
    </SiteSettingsProvider>
  );
}
