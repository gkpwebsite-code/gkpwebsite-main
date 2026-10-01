"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";
import Menu from "@/components/layout/Menu";
import { ROUTES } from "@/lib/constants";
import { pauseScroll, resumeScroll } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const SIDE_LABEL =
  "pointer-events-auto cursor-pointer font-logo text-xl leading-none font-bold tracking-[-0.02em] text-paper uppercase [writing-mode:vertical-rl] md:text-3xl lg:text-4xl";

export default function Navbar() {
  const pathname = usePathname();
  const menuId = useId();
  // Tied to the page it was opened on, so any navigation closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);

  useEffect(() => {
    if (!open) return;
    pauseScroll();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOn(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      resumeScroll();
    };
  }, [open]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] mix-blend-difference">
        <Container className="flex max-w-none items-start justify-between px-3 py-6 md:px-5">
          <div data-intro-logo className="inline-block">
            <Logo className="pointer-events-auto text-paper" />
          </div>
          <button
            type="button"
            data-intro-from="right"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpenOn(open ? null : pathname)}
            className={SIDE_LABEL}
          >
            {open ? "Close" : "Menu"}
          </button>
        </Container>
      </header>
      <Menu id={menuId} open={open} pathname={pathname} onClose={close} />
      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mix-blend-difference">
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
