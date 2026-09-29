"use client";

import Container from "@/components/common/Container";
import { EASE } from "@/lib/theme";
import { useReveal } from "@/lib/useReveal";

export default function PagePlaceholder({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const [ref, visible] = useReveal<HTMLDivElement>();

  const rise = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 28px, 0)",
    transition: `opacity 1s ${EASE} ${delay}ms, transform 1.2s ${EASE} ${delay}ms`,
  });

  return (
    <section className="flex min-h-[80vh] items-end bg-canvas pt-40 pb-24 text-ink">
      <Container>
        <div ref={ref}>
          <p
            className="text-[0.6875rem] tracking-eyebrow text-muted uppercase"
            style={rise(0)}
          >
            {eyebrow}
          </p>
          <h1
            className="mt-6 font-title text-5xl tracking-tight md:text-7xl"
            style={rise(120)}
          >
            {title}
          </h1>
          <div
            className="mt-10 h-px w-full origin-left bg-ink/20"
            style={{
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 1.4s ${EASE} 240ms`,
            }}
          />
        </div>
      </Container>
    </section>
  );
}
