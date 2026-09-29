import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";

export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <Container className="flex max-w-none items-center justify-start px-3 py-6 md:px-5">
        <div data-intro-logo className="inline-block">
          <Logo className="pointer-events-auto text-paper" />
        </div>
      </Container>
    </header>
  );
}
