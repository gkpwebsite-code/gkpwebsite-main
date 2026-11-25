import Link from "next/link";
import RollingWord from "@/components/common/RollingWord";
import { ROUTES } from "@/lib/constants";

/**
 * Faint "( 404 )" markers framing the message. No bottom-left one: the fixed GK monogram
 * sits there.
 */
const MARKERS = [
  "top-0 left-0",
  "top-0 left-1/2 -translate-x-1/2",
  "top-0 right-0",
  "top-1/2 left-0 -translate-y-1/2",
  "top-1/2 right-0 -translate-y-1/2",
  "bottom-0 right-0",
] as const;

export default function NotFoundView() {
  return (
    <section className="relative flex min-h-svh items-center justify-center bg-canvas px-6 py-28 text-ink md:px-24 md:py-32">
      {/* Inset so the markers clear the fixed logo, side labels and corner controls. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 inset-y-24 hidden sm:block md:inset-x-24 md:inset-y-28"
      >
        {MARKERS.map((position) => (
          <span
            key={position}
            className={`absolute ${position} font-logo-sub text-[0.6875rem] leading-none tracking-[0.6em] text-muted/60 md:text-xs`}
          >
            ( 404 )
          </span>
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center">
        <p className="mb-6 font-logo-sub text-[0.6875rem] leading-none tracking-[0.6em] text-muted/70 sm:hidden">
          ( 404 )
        </p>
        <h1 className="font-logo text-[clamp(3.25rem,11vw,9.5rem)] leading-[0.88] font-bold tracking-[-0.035em] uppercase">
          Nothing
          <br />
          found
        </h1>
        <p className="mt-8 max-w-[26rem] font-logo-sub text-[0.6875rem] leading-[1.7] tracking-[0.12em] text-muted uppercase md:mt-10 md:text-xs">
          This page doesn&rsquo;t exist. The link may be old, or the address may
          have a typo.
        </p>
        <Link
          href={ROUTES.HOME}
          aria-label="Back to photos"
          className="group mt-12 border-b border-ink pb-1.5 font-logo text-sm font-bold tracking-[0.04em] uppercase md:mt-16 md:text-base"
        >
          <RollingWord text="Back to photos" />
        </Link>
      </div>
    </section>
  );
}
