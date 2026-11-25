"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { sendInquiry } from "@/lib/inquiry-actions";
import RollingWord from "@/components/common/RollingWord";
import { GALLERIES, ROUTES } from "@/lib/constants";
import {
  INQUIRY_OPTIONS,
  validateInquiry,
  type InquiryErrors,
  type InquiryState,
} from "@/lib/inquiry";
import { pauseScroll, resumeScroll, useLenis } from "@/lib/lenis";
import type { FaqEntry } from "@/lib/site-content";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";
import InquireDates from "./InquireDates";
import InquireFaq from "./InquireFaq";
import { Field, FieldError, LEGEND, Pills, TextArea } from "./InquireFields";
import InquirePhone from "./InquirePhone";
import { useSiteSettings } from "@/components/layout/SiteSettingsProvider";

/** The first six portfolio couples; the photo panel turns through them evenly down the page. */
const COUPLES = GALLERIES.slice(0, 6);

/** Where each cover's faces sit, so edge-to-edge crops trim sky and floor instead of heads. */
const FOCUS: Record<string, string> = {
  "sharon-ishan": "50% 45%",
  "sofia-harshil": "50% 20%",
  "sharanya-vinay": "50% 0%",
  "nabeiha-zuber": "50% 15%",
  "shivanee-rajat": "50% 55%",
  "inayat-jasdeep": "50% 25%",
};
const focusOf = (slug: string) => FOCUS[slug] ?? "50% 30%";

const CHAPTERS = ["About you", "Your celebration", "Your story"] as const;

const DETAIL_LABEL =
  "mb-2 block font-logo-sub text-[0.625rem] leading-none tracking-[0.18em] text-ink/40 uppercase md:text-[0.6875rem]";
const DETAIL_VALUE =
  "font-logo text-base leading-snug font-bold tracking-[-0.01em] bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px] md:text-lg";

const INITIAL: InquiryState = { status: "idle" };

const desktopQuery = () => window.matchMedia("(min-width: 48rem)");
const subscribeDesktop = (onChange: () => void) => {
  const query = desktopQuery();
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * Desktop only: a full-height photo beside the form that wipes to the next couple as the page
 * scrolls. It tracks scroll itself so the form never re-renders while you read.
 */
function PhotoPanel({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [photo, setPhoto] = useState({ active: 0, previous: -1 });
  // Phones never see this panel, so they never download its six photos.
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => desktopQuery().matches,
    () => false,
  );

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = content.getBoundingClientRect();
      const range = height - window.innerHeight;
      const progress =
        range > 0 ? Math.min(Math.max(-top / range, 0), 0.9999) : 0;
      const next = Math.floor(progress * COUPLES.length);
      setPhoto((current) =>
        current.active === next
          ? current
          : { active: next, previous: current.active },
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [contentRef]);

  const couple = COUPLES[photo.active];
  return (
    <div className="relative hidden h-svh overflow-hidden bg-ink md:sticky md:top-0 md:block">
      <div className="absolute inset-0">
        {desktop &&
          COUPLES.map(({ slug, cover }, index) => (
            <Image
              key={slug}
              src={cover}
              alt=""
              fill
              quality={90}
              sizes="50vw"
              // All six load upfront so a turn never waits on the network mid-scroll.
              loading="eager"
              fetchPriority={index === 0 ? "high" : "low"}
              style={{ objectPosition: focusOf(slug) }}
              data-active={index === photo.active ? "" : undefined}
              data-previous={index === photo.previous ? "" : undefined}
              className="z-0 scale-[1.15] object-cover transition-[clip-path,scale] duration-[1400ms,2600ms] ease-[cubic-bezier(0.76,0,0.24,1)] will-change-[clip-path,scale] [clip-path:inset(100%_0_0_0)] data-active:z-[2] data-active:scale-100 data-active:[clip-path:inset(0)] data-previous:z-[1] data-previous:scale-100 data-previous:[clip-path:inset(0)]"
            />
          ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-black/45 to-transparent" />
      <div className="absolute bottom-10 left-5 z-[3] flex items-baseline gap-4 text-paper">
        <span className="block overflow-hidden font-logo text-sm leading-none font-bold tabular-nums">
          <span
            key={photo.active}
            className="block animate-[inquire-count_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
          >
            0{photo.active + 1}
          </span>
        </span>
        <span className="block overflow-hidden">
          <span
            key={couple.slug}
            className="block animate-[inquire-count_900ms_cubic-bezier(0.16,1,0.3,1)_80ms_both] font-logo-sub text-xs leading-none tracking-[0.14em] uppercase opacity-80"
          >
            {couple.title}
          </span>
        </span>
      </div>
    </div>
  );
}

/** Phones: each chapter opens on a photo that wipes in as it scrolls into view. */
function ChapterPhoto({ couple }: { couple: (typeof COUPLES)[number] }) {
  const [ref, visible] = useReveal<HTMLDivElement>(0.25);
  return (
    <div
      ref={ref}
      className="relative -mx-3 mt-6 aspect-[4/5] overflow-hidden md:hidden"
    >
      <Image
        src={couple.cover}
        alt=""
        fill
        quality={90}
        sizes="100vw"
        style={{ objectPosition: focusOf(couple.slug) }}
        className={cn(
          "object-cover transition-[clip-path,scale] duration-[1400ms,2400ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          visible
            ? "scale-100 [clip-path:inset(0)]"
            : "scale-110 [clip-path:inset(100%_0_0_0)]",
        )}
      />
    </div>
  );
}

/** A numbered form chapter that fades up as it scrolls in; phones get its couple's photo up top. */
function Chapter({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const [ref, visible] = useReveal<HTMLElement>(0.08);
  return (
    <section
      ref={ref}
      className={cn(
        "relative border-t border-ink/15 pt-8 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] has-[[data-open]]:z-10 md:pt-10",
        index > 0 && "mt-12 md:mt-16",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      )}
    >
      <p className={LEGEND}>
        0{index + 1} &mdash; {CHAPTERS[index]}
      </p>
      <ChapterPhoto couple={COUPLES[index * 2 + 1]} />
      {children}
    </section>
  );
}

function ThankYou({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    pauseScroll();
    return () => resumeScroll();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Inquiry sent"
      className="fixed inset-0 z-[45] grid animate-[inquire-thanks-in_1200ms_cubic-bezier(0.76,0,0.24,1)_both] bg-canvas text-ink md:grid-cols-2"
    >
      <div className="relative hidden md:block">
        <Image
          src={COUPLES[4].cover}
          alt=""
          fill
          quality={90}
          sizes="50vw"
          style={{ objectPosition: focusOf(COUPLES[4].slug) }}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center px-3 pr-10 md:px-[5vw] md:pr-24">
        <p className={LEGEND}>Inquiry received</p>
        <h2 className="mt-6 font-display text-[3.5rem] leading-[0.95] md:text-[min(7vw,12svh)]">
          Thank <em className="italic">you.</em>
        </h2>
        <p className="mt-6 max-w-md font-display text-xl leading-snug text-ink/75 md:text-2xl">
          Your story is in our inbox. We&rsquo;ll write back within 24 hours.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 font-logo text-sm font-bold tracking-[0.04em] uppercase">
          <Link
            href={ROUTES.HOME}
            className="group inline-flex items-center gap-3 border-b border-ink pb-2"
          >
            See the portfolio
            <span
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:translate-x-1.5"
            >
              &rarr;
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-ink/50 uppercase transition-colors hover:text-ink"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InquireView({ faq }: { faq: readonly FaqEntry[] }) {
  const contact = useSiteSettings();
  const [state, formAction, pending] = useActionState(sendInquiry, INITIAL);
  const [thanksClosed, setThanksClosed] = useState<InquiryState | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const phoneDigits = contact.phone.replace(/[^\d]/g, "");
  const instagram = contact.socialLinks.find(
    ({ name }) => name === "Instagram",
  );
  const showThanks = state.status === "sent" && thanksClosed !== state;
  const [errors, setErrors] = useState<InquiryErrors>({});
  const hasErrors = Object.keys(errors).length > 0;
  const lenis = useLenis();

  // Checked here first so a slip never reaches the server, which would clear everything typed.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const found = validateInquiry(new FormData(form));
    setErrors(found);
    const first = Object.keys(found)[0];
    if (!first) return;
    event.preventDefault();
    const field = form.elements.namedItem(first);
    if (!(field instanceof HTMLInputElement)) return;
    field.focus({ preventScroll: true });
    if (lenis) lenis.scrollTo(field, { offset: -window.innerHeight / 3 });
    else field.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const clearError = (event: React.FormEvent<HTMLFormElement>) => {
    const { name } = event.target as HTMLInputElement;
    if (!(name in errors)) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[name as keyof InquiryErrors];
      return next;
    });
  };

  return (
    <div className="md:grid md:grid-cols-2">
      <PhotoPanel contentRef={contentRef} />

      {/* Right padding keeps everything clear of the fixed MENU and CONTACT labels. */}
      <div
        ref={contentRef}
        className="px-3 pt-32 pr-10 pb-24 md:px-[5vw] md:pt-40 md:pr-24 md:pb-32"
      >
        <header>
          <p className={LEGEND}>Inquire</p>
          <h1 className="mt-6 font-display text-[3.5rem] leading-[0.95] md:text-[min(6.5vw,12svh)]">
            {["Begin with", "hello."].map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.1em]">
                <span
                  data-inquire-line
                  className={cn("block", index === 1 && "italic")}
                  style={{ "--i": index } as React.CSSProperties}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-md font-display text-xl leading-snug text-ink/75 md:text-2xl">
            Every wedding we photograph begins with a conversation. Tell us
            about the two of you, your people and your plans.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 md:mt-14">
            <div className="col-span-2 sm:col-span-1">
              <span className={DETAIL_LABEL}>Email</span>
              <a
                href={`mailto:${contact.email}`}
                className={cn(DETAIL_VALUE, "break-all")}
              >
                {contact.email}
              </a>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className={DETAIL_LABEL}>Phone</span>
              <a href={`tel:+${phoneDigits}`} className={DETAIL_VALUE}>
                {contact.phone}
              </a>
            </div>
            <div>
              <span className={DETAIL_LABEL}>WhatsApp</span>
              <a
                href={`https://wa.me/${phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className={DETAIL_VALUE}
              >
                Message us
              </a>
            </div>
            {instagram && (
              <div>
                <span className={DETAIL_LABEL}>Instagram</span>
                <a
                  href={instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={DETAIL_VALUE}
                >
                  Follow along
                </a>
              </div>
            )}
          </div>
          <p className="mt-10 font-display text-lg text-ink/60 italic">
            We reply within 24 hours.
          </p>
        </header>

        <form
          action={formAction}
          noValidate
          onSubmit={onSubmit}
          onChange={clearError}
          className="mt-14 md:mt-20"
        >
          {/* Hidden from people; bots that fill it are quietly ignored. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] size-px opacity-0"
          />

          <Chapter index={0}>
            <div className="mt-6 grid gap-x-6 gap-y-6 lg:grid-cols-2">
              <Field
                name="name"
                label="Your names"
                required
                autoComplete="name"
                className="lg:col-span-2"
                error={errors.name}
              />
              <Field
                name="email"
                label="Email"
                type="email"
                required
                autoComplete="email"
                error={errors.email}
              />
              <InquirePhone error={errors.phone} />
              <Field
                name="location"
                label="Where do you live?"
                autoComplete="address-level2"
                className="lg:col-span-2"
              />
            </div>
            <div className="mt-10">
              <Pills
                name="role"
                legend="You are the"
                options={INQUIRY_OPTIONS.role}
              />
            </div>
          </Chapter>

          <Chapter index={1}>
            <div className="mt-8 space-y-10">
              <Pills
                name="eventType"
                legend="Celebration"
                options={INQUIRY_OPTIONS.eventType}
              />
              <InquireDates />
              <Field name="venue" label="Venue & city" />
              <Pills
                name="coverage"
                legend="Coverage"
                options={INQUIRY_OPTIONS.coverage}
              />
            </div>
          </Chapter>

          <Chapter index={2}>
            <div className="mt-8 space-y-10">
              <TextArea name="message" label="Tell us about you two" />
              <Pills
                name="heardFrom"
                legend="How did you find us?"
                options={INQUIRY_OPTIONS.heardFrom}
              />
              <Field name="instagram" label="Your Instagram (optional)" />
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/60">
                  <input
                    type="checkbox"
                    name="consent"
                    aria-required
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby="consent-error"
                    className="mt-1 size-4 shrink-0 cursor-pointer accent-ink aria-invalid:outline-1 aria-invalid:outline-offset-2 aria-invalid:outline-red-800"
                  />
                  <span>
                    I agree to my details being stored so the studio can reply
                    to this inquiry, as described in the{" "}
                    <Link
                      href={ROUTES.PRIVACY}
                      className="underline underline-offset-2"
                    >
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
                <div className="pl-7">
                  <FieldError id="consent-error" error={errors.consent} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="group mt-14 flex w-full cursor-pointer items-center justify-between border-y border-ink py-6 font-logo text-[2rem] leading-none font-bold tracking-[-0.03em] uppercase disabled:cursor-wait md:mt-16 md:py-8 md:text-5xl"
            >
              <span className="sr-only">
                {pending ? "Sending" : "Send inquiry"}
              </span>
              <span className="block overflow-hidden py-[0.1em]">
                <RollingWord text={pending ? "Sending…" : "Send inquiry"} />
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2",
                  pending && "animate-pulse",
                )}
              >
                &rarr;
              </span>
            </button>
            <p aria-live="polite" className="mt-4 min-h-6 text-sm text-red-800">
              {hasErrors
                ? "A few details need another look above."
                : state.status === "error"
                  ? state.message
                  : ""}
            </p>
          </Chapter>
        </form>

        <InquireFaq questions={faq} />
      </div>

      {showThanks && <ThankYou onClose={() => setThanksClosed(state)} />}
    </div>
  );
}
