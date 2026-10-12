"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "./useScrollProgress";

function splitWords(text: string) {
  const words: { text: string; italic: boolean }[] = [];
  let italic = false;
  for (const raw of text.split(" ")) {
    if (raw.startsWith("*")) italic = true;
    words.push({ text: raw.replace(/\*/g, ""), italic });
    if (raw.endsWith("*")) italic = false;
  }
  return words;
}

/**
 * A statement whose words light up one after another as it scrolls through the screen.
 * Wrap a phrase in asterisks (`*as it felt.*`) to set it in italics.
 */
export default function LitStatement({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = splitWords(text);
  const label = text.replace(/\*/g, "");

  const onProgress = useCallback((progress: number) => {
    const spans = ref.current?.children;
    if (!spans) return;
    // Lit between 20% and 60% of the way through, so the last word lands mid-screen.
    const lit = ((progress - 0.2) / 0.4) * spans.length;
    for (let i = 0; i < spans.length; i++) {
      const amount = Math.min(Math.max(lit - i, 0), 1);
      (spans[i] as HTMLElement).style.opacity = String(0.14 + amount * 0.86);
    }
  }, []);
  useScrollProgress(ref, onProgress);

  return (
    <p
      ref={ref}
      aria-label={label}
      className={cn(
        "max-w-[18ch] font-display text-[2.6rem] leading-[1.05] md:text-[min(6.2vw,11svh)]",
        className,
      )}
    >
      {words.map((word, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            "opacity-[0.14] transition-opacity duration-300",
            word.italic && "italic",
          )}
        >
          {word.text}{" "}
        </span>
      ))}
    </p>
  );
}
