"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";
import { ROUTES } from "@/lib/constants";

const SIDE_LABEL =
  "pointer-events-auto font-logo text-2xl leading-none font-bold tracking-[0.06em] text-paper uppercase [writing-mode:vertical-rl] md:text-3xl";

export default function Navbar() {
  const contactRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const contact = contactRef.current;
    if (!contact) return;

    const desktop = window.matchMedia("(min-width: 48rem)");
    let width = window.innerWidth;

    // Pin once against the visible screen, above the browser bar. Ignore later
    // height changes: those fire as the bar hides on scroll and would make it drift.
    const place = () => {
      if (desktop.matches || contact.offsetHeight === 0) {
        contact.style.top = "";
        contact.style.bottom = "";
        return;
      }
      const visibleHeight = window.visualViewport?.height ?? window.innerHeight;
      contact.style.bottom = "auto";
      contact.style.top = `${visibleHeight - contact.offsetHeight - 24}px`;
    };

    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      place();
    };

    place();
    document.fonts.ready.then(place);
    window.addEventListener("resize", onResize);
    desktop.addEventListener("change", place);
    return () => {
      window.removeEventListener("resize", onResize);
      desktop.removeEventListener("change", place);
    };
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <Container className="flex max-w-none items-start justify-between px-3 py-6 md:px-5">
          <div data-intro-logo className="inline-block">
            <Logo className="pointer-events-auto text-paper" />
          </div>
          <button type="button" data-intro-from="right" className={SIDE_LABEL}>
            Menu
          </button>
        </Container>
      </header>
      <Link
        ref={contactRef}
        href={ROUTES.CONTACT}
        data-intro-from="right"
        className={`fixed right-3 bottom-28 z-50 mix-blend-difference md:right-5 md:bottom-6 ${SIDE_LABEL}`}
      >
        Contact
      </Link>
    </>
  );
}
