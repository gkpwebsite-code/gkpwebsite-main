"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  CONTACT_DETAILS,
  FOOTER_LINKS,
  LEGAL_LINKS,
  ROUTES,
  SITE_NAME,
  SOCIAL_LINKS,
  WEBSITE_CREDIT,
} from "@/lib/constants";
import RollingWord from "@/components/common/RollingWord";
import FooterWordmark from "./FooterWordmark";
import { useLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const LABEL =
  "mb-4 block font-logo-sub text-[0.625rem] leading-none tracking-[0.18em] text-ink/40 uppercase md:text-[0.6875rem]";
const VALUE =
  "font-logo text-base leading-snug font-bold tracking-[-0.01em] md:text-lg";
const UNDERLINE =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]";
const SMALL =
  "font-logo-sub text-[0.6875rem] leading-none tracking-[0.1em] text-ink/45 uppercase md:text-[0.75rem] md:tracking-[0.12em]";

/** Every page but a gallery ends with this; galleries close on their next-wedding panel. */
export default function SiteFooter() {
  const pathname = usePathname();
  const bottomRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // While the footer's bottom rows are on screen, the corner * filter steps aside for the wordmark.
  useEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom) return;
    const root = document.documentElement;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) root.dataset.footer = "";
      else delete root.dataset.footer;
    });
    observer.observe(bottom);
    return () => {
      observer.disconnect();
      delete root.dataset.footer;
    };
  }, [pathname]);

  if (/^\/portfolio\/[^/]+/.test(pathname)) return null;

  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const year = new Date().getFullYear();
  const phoneHref = `tel:${CONTACT_DETAILS.phone.replace(/[^\d+]/g, "")}`;

  return (
    // Desktop: exactly one screen tall at most content sizes, with a top band left clear for the fixed logo.
    <footer
      key={pathname}
      className="flex flex-col bg-canvas pb-3 text-ink md:min-h-svh md:pb-5"
    >
      {/* Right padding keeps everything clear of the fixed CONTACT label. */}
      <div className="px-3 pt-16 pr-10 md:flex md:flex-1 md:flex-col md:px-5 md:pt-28 md:pr-20">
        <div className="md:mb-10 md:grid md:grid-cols-12 md:items-end md:gap-x-6">
          <div className="md:col-span-5">
            <p className="font-logo-sub text-[0.625rem] leading-none tracking-[0.2em] text-ink/50 uppercase md:text-xs">
              Inquire
            </p>
            <h2 className="mt-5 font-display text-[2.75rem] leading-[0.95] md:mt-6 md:text-[min(6vw,9svh)]">
              Let&rsquo;s tell
              <br />
              <em className="italic">your story.</em>
            </h2>
            <Link
              href={ROUTES.CONTACT}
              className="group mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 font-logo text-sm font-bold tracking-[0.04em] uppercase md:mt-10 md:text-base"
            >
              Start your inquiry
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
              >
                &rarr;
              </span>
            </Link>
          </div>

          {/* Phones: contact full width, studio and follow side by side, explore as one wrapping row. Desktop: two pairs beside the invitation. */}
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-7 md:mt-0 md:gap-y-10">
            <div className="col-span-2 md:col-span-1">
              <span className={LABEL}>Contact</span>
              <a
                href={`mailto:${CONTACT_DETAILS.email}`}
                className={cn(VALUE, UNDERLINE, "break-all")}
              >
                {CONTACT_DETAILS.email}
              </a>
              <br />
              <a href={phoneHref} className={cn(VALUE, UNDERLINE)}>
                {CONTACT_DETAILS.phone}
              </a>
            </div>

            <div>
              <span className={LABEL}>Studio</span>
              <p className={VALUE}>Based in {CONTACT_DETAILS.city}</p>
              <p className="mt-1 font-display text-base leading-snug italic md:text-xl">
                Available worldwide
              </p>
            </div>

            <div>
              <span className={LABEL}>Follow</span>
              <ul>
                {SOCIAL_LINKS.map(({ name, href }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(VALUE, UNDERLINE)}
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <span className={LABEL}>Explore</span>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 md:block">
                {FOOTER_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className={cn(VALUE, UNDERLINE)}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          ref={bottomRef}
          className={cn(
            SMALL,
            "mt-10 flex flex-col gap-5 border-t border-ink/10 pt-6 md:mt-auto md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-3",
          )}
        >
          {/* Phones stack these as rows; from md up the wrappers dissolve into one line. */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:contents">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors duration-300 hover:text-ink"
              >
                {label}
              </Link>
            ))}
          </div>
          <span>
            &copy; {year} {SITE_NAME}
          </span>
          <div className="flex items-baseline justify-between gap-x-6 md:contents">
            <a
              href={WEBSITE_CREDIT.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Website by ${WEBSITE_CREDIT.name}`}
              className="group inline-flex items-baseline gap-2 md:ml-auto"
            >
              <span aria-hidden="true">Website by</span>
              {/* On hover the letters roll and the underline sweeps out to the right, then redraws from the left. */}
              <span className="relative inline-block pb-1 font-logo font-bold tracking-[0.02em] text-ink">
                <span className="block overflow-hidden py-[0.15em]">
                  <RollingWord text={WEBSITE_CREDIT.name} />
                </span>
                <span className="absolute inset-x-0 bottom-0 h-px bg-current group-hover:animate-[underline-sweep_900ms_cubic-bezier(0.65,0,0.35,1)] group-focus-visible:animate-[underline-sweep_900ms_cubic-bezier(0.65,0,0.35,1)]" />
              </span>
            </a>
            <button
              type="button"
              onClick={backToTop}
              className="cursor-pointer tracking-[inherit] uppercase transition-colors duration-300 hover:text-ink"
            >
              Back to top &uarr;
            </button>
          </div>
        </div>
      </div>

      <FooterWordmark />
    </footer>
  );
}
