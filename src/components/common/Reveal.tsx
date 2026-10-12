"use client";

import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

/** Fades and lifts its children into place the first time they scroll into view. */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, visible] = useReveal<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,translate] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
