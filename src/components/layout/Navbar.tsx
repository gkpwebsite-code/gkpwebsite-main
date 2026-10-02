"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";
import Menu, { PANEL_CLOSE_MS } from "@/components/layout/Menu";
import { ROUTES } from "@/lib/constants";
import { pauseScroll, resumeScroll } from "@/lib/lenis";
import { SIDE_LABEL } from "@/lib/sideLabel";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const menuId = useId();
  // Tied to the page it was opened on, so any navigation closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);
  const chromeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    // Solid menu-coloured chrome over the panel, held until the panel has fully closed.
    const root = document.documentElement;
    window.clearTimeout(chromeTimer.current);
    root.dataset.menu = "";
    pauseScroll();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOn(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      resumeScroll();
      chromeTimer.current = window.setTimeout(() => {
        delete root.dataset.menu;
      }, PANEL_CLOSE_MS);
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] text-paper mix-blend-difference in-data-[menu]:text-menu-text in-data-[menu]:mix-blend-normal">
        <Container className="flex max-w-none items-start justify-between px-3 py-6 md:px-5">
          <div data-intro-logo className="inline-block">
            <Logo className="pointer-events-auto" />
          </div>
          <button
            type="button"
            data-intro-from="right"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpenOn(open ? null : pathname)}
            className={cn(
              SIDE_LABEL,
              "transition-opacity duration-300 hover:opacity-60 focus-visible:opacity-60",
            )}
          >
            {open ? "Close" : "Menu"}
          </button>
        </Container>
      </header>
      <Menu id={menuId} open={open} pathname={pathname} onClose={close} />
      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 text-paper mix-blend-difference">
        <Container className="flex max-w-none items-end justify-end px-3 pt-6 pb-8 md:px-5 md:pb-12">
          <Link
            href={ROUTES.CONTACT}
            data-intro-from="right"
            className={cn(SIDE_LABEL, "tracking-[0.03em]")}
          >
            Contact
          </Link>
        </Container>
      </footer>
    </>
  );
}
