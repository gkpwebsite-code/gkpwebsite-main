import Link from "next/link";
import { ROUTES, SITE_NAME, SITE_SHORT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.HOME}
      aria-label={SITE_NAME}
      className={cn("inline-flex w-max flex-col items-center", className)}
    >
      <span className="font-logo text-2xl leading-none font-bold tracking-[0.06em] whitespace-nowrap uppercase md:text-3xl">
        {SITE_SHORT_NAME}
      </span>
      <span
        aria-hidden="true"
        className="mt-0.5 -mr-[0.15em] font-logo-sub text-[0.5625rem] leading-none font-normal tracking-[0.15em] uppercase md:text-[0.625rem]"
      >
        Photography
      </span>
    </Link>
  );
}
