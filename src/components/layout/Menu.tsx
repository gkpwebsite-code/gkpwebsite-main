"use client";

import Link from "next/link";
import {
  LEGAL_LINKS,
  MENU_LINKS,
  ROUTES,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Panel unveils top-down; its contents rise in once it is mostly drawn. */
const PANEL_OPEN_MS = 900;
const PANEL_CLOSE_MS = 700;
const ITEM_DELAY_MS = 380;
const ITEM_STAGGER_MS = 90;

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

/** Each letter rolls out and back in on hover, echoing the opening intro. */
function RollingWord({ text }: { text: string }) {
  return (
    <span className="whitespace-nowrap" aria-hidden="true">
      {Array.from(text).map((character, index) => (
        <span
          key={index}
          className="inline-block group-hover:animate-[intro-letter-roll_900ms_both] group-focus-visible:animate-[intro-letter-roll_900ms_both]"
          style={{ animationDelay: `${index * 25}ms` }}
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
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

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-[55] bg-night text-paper transition-[clip-path] ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none",
        open
          ? "[clip-path:inset(0_0_0_0)]"
          : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
      )}
      style={{
        transitionDuration: `${open ? PANEL_OPEN_MS : PANEL_CLOSE_MS}ms`,
      }}
    >
      <div className="flex h-full flex-col justify-between px-3 pt-36 pb-6 md:px-5 md:pt-44 md:pr-24 md:pb-8">
        <div className="self-end text-right">
          <Rise open={open} order={0} className="-my-[0.04em] py-[0.04em]">
            <Link
              href={ROUTES.CONTACT}
              tabIndex={tabIndex}
              onClick={onClose}
              aria-label="Contact"
              className="group block font-logo text-[14vw] leading-[0.86] font-bold tracking-[-0.03em] uppercase md:text-[9vw] lg:text-[8vw]"
            >
              <RollingWord text="Contact" />
            </Link>
          </Rise>
          <Rise open={open} order={1} className="mt-4 md:mt-5">
            <ul className="flex justify-end gap-5 font-logo-sub text-xs leading-none tracking-[0.15em] text-paper/60 uppercase md:text-sm">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={tabIndex}
                    className="transition-colors hover:text-paper"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </Rise>
        </div>

        <div>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <nav aria-label="Main">
              <ul className="flex flex-col">
                {MENU_LINKS.map((link, index) => {
                  const active = link.href === pathname;
                  return (
                    <li
                      key={link.href}
                      className="-my-[0.04em] overflow-hidden py-[0.04em]"
                    >
                      <Link
                        href={link.href}
                        tabIndex={tabIndex}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        aria-label={link.label}
                        style={riseDelay(open, index + 1)}
                        className={cn(
                          riseClass(open),
                          "group flex items-start gap-2 font-logo text-[10vw] leading-[0.86] font-bold tracking-[-0.03em] uppercase transition-[translate,opacity,color] md:gap-4 md:text-[8.5vw] lg:text-[7.5vw]",
                          active
                            ? "text-paper"
                            : "text-paper/30 hover:text-paper focus-visible:text-paper",
                        )}
                      >
                        <span className="mt-[0.5em] font-caption text-[0.625rem] leading-none font-normal tracking-[0.15em] md:text-xs">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <RollingWord text={link.label} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <Rise open={open} order={MENU_LINKS.length + 1}>
              <Link
                href={ROUTES.FAQ}
                tabIndex={tabIndex}
                onClick={onClose}
                aria-current={pathname === ROUTES.FAQ ? "page" : undefined}
                aria-label="FAQ"
                className="group block font-logo text-2xl leading-none font-bold tracking-[-0.02em] uppercase md:text-right md:text-3xl"
              >
                <RollingWord text="FAQ" />
              </Link>
            </Rise>
          </div>

          <Rise
            open={open}
            order={MENU_LINKS.length + 2}
            className="mt-8 md:mt-10"
          >
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-logo-sub text-[0.625rem] leading-none tracking-[0.15em] text-paper/40 uppercase">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    tabIndex={tabIndex}
                    onClick={onClose}
                    className="transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                &copy; {new Date().getFullYear()} {SITE_NAME}
              </li>
            </ul>
          </Rise>
        </div>
      </div>
    </div>
  );
}
