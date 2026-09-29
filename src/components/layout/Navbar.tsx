import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";

export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <Container className="flex max-w-none items-start justify-between px-3 py-6 md:px-5">
        <div data-intro-logo className="inline-block">
          <Logo className="pointer-events-auto text-paper" />
        </div>
        <button
          type="button"
          data-intro-fade
          className="pointer-events-auto font-logo text-2xl leading-none font-bold tracking-[0.06em] text-paper uppercase [writing-mode:vertical-rl] md:text-3xl"
        >
          Menu
        </button>
      </Container>
    </header>
  );
}
