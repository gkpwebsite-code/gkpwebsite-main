import Link from "next/link";
import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";
import { ROUTES } from "@/lib/constants";

const SIDE_LABEL =
  "pointer-events-auto font-logo text-2xl leading-none font-bold tracking-[0.06em] text-paper uppercase [writing-mode:vertical-rl] md:text-3xl";

export default function Navbar() {
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
      <div className="pointer-events-none fixed right-0 bottom-0 z-50 pr-3 pb-8 mix-blend-difference md:pr-5 md:pb-12">
        <Link href={ROUTES.CONTACT} data-intro-from="right" className={`block ${SIDE_LABEL}`}>
          Contact
        </Link>
      </div>
    </>
  );
}
