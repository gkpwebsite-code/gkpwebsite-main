import Link from "next/link";
import { Question } from "@/components/pages/InquirePage/InquireFaq";
import { LEGEND } from "@/components/pages/InquirePage/InquireFields";
import { ROUTES } from "@/lib/constants";
import { FAQ } from "@/lib/faq";

/** A short list of the questions couples ask most, each opening to its answer. */
export default function FaqView() {
  return (
    <article className="px-3 pt-32 pr-10 pb-24 md:px-[5vw] md:pt-40 md:pr-24 md:pb-32">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-16">
        <header className="md:sticky md:top-40 md:self-start">
          <p className={LEGEND}>Good to know</p>
          <h1 className="mt-6 font-display text-[3.5rem] leading-[0.95] md:text-[min(6vw,12svh)]">
            Questions, <span className="italic">answered</span>
          </h1>
          <p className="mt-8 max-w-sm font-display text-xl leading-snug text-ink/75 md:text-2xl">
            The things couples ask us most. Anything else, just write.
          </p>
        </header>

        <div>
          <div className="border-t border-ink/15">
            {FAQ.map((item) => (
              <Question key={item.question} {...item} />
            ))}
          </div>
          <Link
            href={ROUTES.CONTACT}
            className="group mt-10 inline-flex items-center gap-3 font-logo text-sm font-bold tracking-[0.04em] uppercase"
          >
            Ask us anything
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
