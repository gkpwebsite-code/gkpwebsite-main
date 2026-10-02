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
  SITE_SHORT_NAME,
  SOCIAL_LINKS,
  WEBSITE_CREDIT,
} from "@/lib/constants";
import RollingWord from "@/components/common/RollingWord";
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

/**
 * Wordmark sized to the row: Forma Micro Bold "GAUTAM KHULLAR" is ~8.34em wide at -0.03em
 * tracking, so the font size is the free width over 8.4. The right padding clears CONTACT.
 */
const WORDMARK_SIZE =
  "pr-10 text-[calc((100vw-3.25rem)/8.4)] md:pr-20 md:text-[calc((100vw-6.25rem)/8.4)]";

/** Every page but a gallery ends with this; galleries close on their next-wedding panel. */
export default function SiteFooter() {
  const pathname = usePathname();
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    if (!wordmark) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        wordmark.dataset.inview = "";
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(wordmark);
    return () => observer.disconnect();
  }, [pathname]);

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
    <footer key={pathname} className="bg-canvas pb-3 text-ink md:pb-5">
      {/* Right padding keeps everything clear of the fixed CONTACT label. */}
      <div className="px-3 pt-16 pr-10 md:px-5 md:pt-24 md:pr-20">
        <div>
          <p className="font-logo-sub text-[0.625rem] leading-none tracking-[0.2em] text-ink/50 uppercase md:text-xs">
            Inquire
          </p>
          <h2 className="mt-5 font-display text-[2.75rem] leading-[0.95] md:mt-6 md:text-7xl lg:text-8xl">
            Let&rsquo;s tell
            <br />
            <em className="italic">your story.</em>
          </h2>
          <Link
            href={ROUTES.CONTACT}
            className="group mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 font-logo text-sm font-bold tracking-[0.04em] uppercase md:mt-14 md:text-base"
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

        {/* Phones: contact full width, studio and follow side by side, explore as one wrapping row. */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-20 md:grid-cols-4 md:gap-y-10">
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

        <div
          ref={bottomRef}
          className={cn(
            SMALL,
            "mt-10 flex flex-col gap-5 border-t border-ink/10 pt-6 md:mt-12 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-3",
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

      <p
        ref={wordmarkRef}
        aria-hidden="true"
        className={cn(
          WORDMARK_SIZE,
          "mt-10 overflow-hidden pl-3 font-logo leading-none font-bold tracking-[-0.03em] whitespace-nowrap uppercase md:mt-14 md:pl-5",
        )}
      >
        {Array.from(SITE_SHORT_NAME.toUpperCase()).map((letter, index) => (
          <span
            key={index}
            data-footer-letter
            className="inline-block pb-[0.08em]"
            style={{ "--i": index } as React.CSSProperties}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </p>
    </footer>
  );
}
