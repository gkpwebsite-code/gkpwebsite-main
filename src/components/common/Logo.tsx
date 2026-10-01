import Link from "next/link";
import { ROUTES, SITE_NAME, SITE_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const DISCIPLINE = "Photography";

/** Splits a line into letters that roll out of view and back into place during the opening intro. */
function IntroLetters({ text, offset }: { text: string; offset: number }) {
  return (
    <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
      {Array.from(text).map((character, index) => (
        <span
          key={index}
          data-intro-letter
          className="inline-block"
          style={{ "--i": offset + index } as React.CSSProperties}
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.HOME}
      aria-label={SITE_NAME}
      className={cn("inline-flex w-max flex-col items-center", className)}
    >
      <span className="font-logo text-xl leading-none font-bold tracking-[0.06em] whitespace-nowrap uppercase md:text-3xl">
        <IntroLetters text={SITE_SHORT_NAME} offset={0} />
      </span>
      <span
        aria-hidden="true"
        className="mt-0.5 -mr-[0.15em] font-logo-sub text-[0.46875rem] leading-none font-normal tracking-[0.15em] uppercase md:text-[0.625rem]"
      >
        <IntroLetters text={DISCIPLINE} offset={SITE_SHORT_NAME.length} />
      </span>
    </Link>
  );
}
