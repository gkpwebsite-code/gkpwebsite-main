import Link from "next/link";
import Container from "@/components/common/Container";
import {
  FOOTER_LINKS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";

export default function SiteFooter() {
  return (
    <footer className="bg-night text-paper">
      <Container className="flex flex-col gap-12 py-16 md:flex-row md:items-end md:justify-between md:py-20">
        <div>
          <p className="font-title text-3xl md:text-4xl">{SITE_SHORT_NAME}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/70">
            {SITE_DESCRIPTION}
          </p>
        </div>

        <div className="flex flex-col gap-8 md:items-end">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-6">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.6875rem] tracking-nav text-paper/70 uppercase transition-colors duration-300 hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex gap-4">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="block text-paper/70 transition-colors duration-300 hover:text-paper"
                >
                  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                    <path
                      d={social.icon}
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <p className="text-xs text-paper/50">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </Container>
    </footer>
  );
}
