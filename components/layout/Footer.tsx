import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--gk-line)]">
      <div className="editorial-container flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl text-[var(--gk-ink)] md:text-3xl">
            Gautam Khullar
          </p>
          <p className="font-body mt-2 max-w-sm text-sm text-[var(--gk-ink-soft)]">
            Wedding photography shaped as editorial film — light, connection,
            and stories that remain.
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link
            href="/weddings"
            className="text-label text-[var(--gk-ink-soft)] hover:text-[var(--gk-ink)]"
          >
            Weddings
          </Link>
          <Link
            href="/about"
            className="text-label text-[var(--gk-ink-soft)] hover:text-[var(--gk-ink)]"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-label text-[var(--gk-ink-soft)] hover:text-[var(--gk-ink)]"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
