import Link from "next/link";
import { NAV_LINKS, SITE } from "@/constants/site";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="editorial-container flex items-center justify-between py-6">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.08em] text-[var(--gk-ink)] uppercase md:text-2xl"
        >
          {SITE.shortName}
        </Link>
        <ul className="flex items-center gap-6 md:gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-label text-[var(--gk-ink-soft)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--gk-ink)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
