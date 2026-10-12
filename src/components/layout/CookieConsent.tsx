"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ROUTES } from "@/lib/constants";

const STORAGE_KEY = "gkp-cookie-consent";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // The card waits for the intro to finish, which is announced on <html data-intro>.
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-intro"],
  });
  return () => {
    listeners.delete(listener);
    observer.disconnect();
  };
}

function shouldShow() {
  return (
    document.documentElement.dataset.intro === "done" &&
    localStorage.getItem(STORAGE_KEY) === null
  );
}

function accept() {
  localStorage.setItem(STORAGE_KEY, "accepted");
  listeners.forEach((listener) => listener());
}

/** Bottom-right cookie notice, tucked beside the vertical CONTACT label; once accepted it never returns. */
export default function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, shouldShow, () => false);

  return (
    <section
      role="dialog"
      aria-label="Cookie and privacy notice"
      aria-hidden={!visible}
      inert={!visible}
      data-visible={visible ? "" : undefined}
      className="pointer-events-none fixed right-12 bottom-6 left-3 z-[45] translate-y-6 rounded-[1.75rem] bg-paper p-6 text-ink opacity-0 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:pointer-events-auto data-visible:translate-y-0 data-visible:opacity-100 sm:left-auto sm:w-[26rem] md:right-20 md:bottom-12 md:p-8 lg:right-24"
    >
      <h2 className="font-logo text-lg leading-none font-bold tracking-[-0.01em] uppercase md:text-xl">
        Cookie &amp; privacy
      </h2>
      <div className="mt-4 flex items-end justify-between gap-6 md:mt-5">
        <p className="font-logo-sub text-[0.6875rem] leading-relaxed tracking-[0.06em] text-ink/45 uppercase md:text-xs">
          This website uses cookies to ensure you get the best experience. See
          our{" "}
          <Link
            href={ROUTES.PRIVACY}
            className="underline underline-offset-2 transition-colors hover:text-ink"
          >
            privacy policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 cursor-pointer border-b border-ink/40 pb-0.5 font-logo-sub text-xs tracking-[0.06em] text-ink/60 uppercase transition-colors hover:border-ink hover:text-ink"
        >
          Got it
        </button>
      </div>
    </section>
  );
}
