"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ROUTES } from "@/lib/constants";
import type { FaqEntry } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { LEGEND } from "./InquireFields";

/** One question that opens to its answer. */
export function Question({ question, answer }: FaqEntry) {
  const [open, setOpen] = useState(false);
  const answerId = useId();

  return (
    <div className="border-b border-ink/15">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left font-display text-xl leading-tight md:py-6 md:text-2xl"
      >
        {question}
        {/* A plus whose upright stroke turns flat into a minus when open. */}
        <span aria-hidden="true" className="relative size-3.5 shrink-0">
          <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
          <span
            className={cn(
              "absolute inset-y-0 left-1/2 w-px bg-current transition-[rotate] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]",
              open && "rotate-90",
            )}
          />
        </span>
      </button>
      <div
        id={answerId}
        data-open={open ? "" : undefined}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-open:grid-rows-[1fr]"
      >
        <div className="overflow-hidden">
          <p className="max-w-lg pb-6 text-base leading-relaxed text-ink/70 md:text-[1.0625rem]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InquireFaq({
  questions,
}: {
  questions: readonly FaqEntry[];
}) {
  return (
    <section className="mt-24 md:mt-32">
      <p className={LEGEND}>Before you write</p>
      <div className="mt-4 border-t border-ink/15">
        {questions.slice(0, 4).map((item) => (
          <Question key={item.question} {...item} />
        ))}
      </div>
      <Link
        href={ROUTES.FAQ}
        className="group mt-8 inline-flex items-center gap-3 font-logo text-sm font-bold tracking-[0.04em] uppercase"
      >
        All questions
        <span
          aria-hidden="true"
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
        >
          &rarr;
        </span>
      </Link>
    </section>
  );
}
