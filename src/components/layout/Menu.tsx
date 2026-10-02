"use client";

import Link from "next/link";
import RollingWord from "@/components/common/RollingWord";
import {
  LEGAL_LINKS,
  MENU_LINKS,
  ROUTES,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import PalettePicker from "./PalettePicker";

/** Panel unveils top-down; its contents rise in once it is mostly drawn. */
const PANEL_OPEN_MS = 900;
export const PANEL_CLOSE_MS = 700;
const ITEM_DELAY_MS = 380;
const ITEM_STAGGER_MS = 90;

/** Shared by CONTACT and the page links; phones are capped by TESTIMONIALS fitting the width. */
const BIG_TEXT =
  "font-logo text-[13vw] leading-[0.86] font-bold tracking-[-0.03em] uppercase md:text-[8.5vw] lg:text-[8vw]";

/** While any link is hovered, the others fade back and the hovered one turns the accent colour. */
const HOVER_FOCUS =
  "group-has-[[data-menu-link]:hover]/menu:text-menu-text/30 hover:text-menu-accent!";
function riseClass(open: boolean) {
  return cn(
    "block transition-[translate,opacity] ease-[cubic-bezier(0.16,1,0.3,1)]",
    open
      ? "translate-y-0 opacity-100 duration-[1100ms]"
      : "translate-y-[110%] opacity-0 duration-300",
  );
}

function riseDelay(open: boolean, order: number) {
  return {
    transitionDelay: open
      ? `${ITEM_DELAY_MS + order * ITEM_STAGGER_MS}ms`
      : "0ms",
  };
}

/** Masks its content so it rises into view when the menu opens. */
function Rise({
  open,
  order,
  className,
  children,
}: {
  open: boolean;
  order: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className={riseClass(open)} style={riseDelay(open, order)}>
        {children}
      </div>
    </div>
  );
}

export default function Menu({
  id,
  open,
  pathname,
  onClose,
}: {
  id: string;
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  const tabIndex = open ? 0 : -1;
  // The page you're on is left out; /portfolio is the same grid as home.
  const currentPage = pathname === ROUTES.PORTFOLIO ? ROUTES.HOME : pathname;
  const otherPages = MENU_LINKS.filter((link) => link.href !== currentPage);

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-[55] bg-menu-bg text-menu-text transition-[clip-path] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none",
        open
          ? "[clip-path:inset(0_0_0_0)]"
          : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
      )}
      style={{
        transitionDuration: `${open ? PANEL_OPEN_MS : PANEL_CLOSE_MS}ms`,
      }}
    >
      <div className="group/menu flex h-full flex-col justify-between px-3 pt-36 pb-3 md:px-5 md:pt-44 md:pr-24 md:pb-8">
        <div className="self-end text-right">
          <Rise open={open} order={0} className="-my-[0.04em] py-[0.04em]">
            <Link
              href={ROUTES.CONTACT}
              tabIndex={tabIndex}
              onClick={onClose}
              aria-label="Contact"
              data-menu-link
              className={cn(
                "group block transition-colors duration-500",
                BIG_TEXT,
                HOVER_FOCUS,
              )}
            >
              <RollingWord text="Contact" />
            </Link>
          </Rise>
          <Rise open={open} order={1} className="mt-4 md:mt-6">
            <ul className="flex justify-end gap-6 font-logo text-base leading-none font-bold tracking-[-0.01em] uppercase md:text-xl lg:text-2xl">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={tabIndex}
                    data-menu-link
                    className={cn(
                      "transition-colors duration-500",
                      HOVER_FOCUS,
                    )}
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </Rise>
          <Rise open={open} order={2} className="mt-8 md:mt-12">
            <Link
              href={ROUTES.FAQ}
              tabIndex={tabIndex}
              onClick={onClose}
              aria-current={pathname === ROUTES.FAQ ? "page" : undefined}
              aria-label="FAQ"
              data-menu-link
              className={cn(
                "group block font-logo text-4xl leading-none font-bold tracking-[-0.02em] uppercase transition-colors duration-500 md:text-5xl lg:text-6xl",
                HOVER_FOCUS,
              )}
            >
              <RollingWord text="FAQ" />
            </Link>
          </Rise>
        </div>

        <div>
          <nav aria-label="Main">
            <ul className="flex flex-col gap-3 md:gap-0">
              {otherPages.map((link, index) => {
                return (
                  <li
                    key={link.href}
                    className="-my-[0.04em] overflow-hidden py-[0.04em]"
                  >
                    <Link
                      href={link.href}
                      tabIndex={tabIndex}
                      onClick={onClose}
                      aria-label={link.label}
                      style={riseDelay(open, index + 1)}
                      data-menu-link
                      className={cn(
                        riseClass(open),
                        BIG_TEXT,
                        HOVER_FOCUS,
                        "group transition-[translate,opacity,color]",
                      )}
                    >
                      <RollingWord text={link.label} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Rise
            open={open}
            order={otherPages.length + 1}
            className="mt-16 md:mt-10"
          >
            <ul className="flex justify-between font-logo-sub text-[0.5625rem] leading-none tracking-[0.1em] text-menu-text/35 uppercase md:justify-start md:gap-x-6 md:text-[0.8125rem] md:tracking-[0.12em]">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    tabIndex={tabIndex}
                    onClick={onClose}
                    className="transition-colors hover:text-menu-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                &copy; {new Date().getFullYear()}
                <span className="hidden md:inline"> {SITE_NAME}</span>
              </li>
            </ul>
          </Rise>
        </div>
      </div>

      <div className="absolute top-24 left-3 md:top-auto md:right-5 md:bottom-8 md:left-auto">
        <PalettePicker tabIndex={tabIndex} />
      </div>
    </div>
  );
}
