import Link from "next/link";
import { CONTACT_DETAILS, ROUTES, SITE_NAME } from "@/lib/constants";

const LAST_UPDATED = "12 October 2026";

const LEGEND =
  "font-logo-sub text-[0.6875rem] leading-none tracking-[0.14em] text-ink/45 uppercase md:text-xs";

const email = (
  <a
    href={`mailto:${CONTACT_DETAILS.email}`}
    className="underline underline-offset-2 transition-colors hover:text-ink"
  >
    {CONTACT_DETAILS.email}
  </a>
);

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        {SITE_NAME} is a wedding photography and film studio led by Gautam
        Khullar, based in {CONTACT_DETAILS.city}. This policy explains what
        happens to the details you share with us through this website. For any
        question about it, write to {email}.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <>
        <p>
          When you send an inquiry we receive what you choose to tell us: your
          names, email, phone or WhatsApp number, where you live, your role in
          the wedding, dates, venue, the coverage you are interested in, how you
          found us, your Instagram handle and your message.
        </p>
        <p>
          When you browse, we see anonymous, aggregated statistics such as which
          pages are visited and how quickly they load. These do not identify
          you.
        </p>
      </>
    ),
  },
  {
    title: "How we use it",
    body: (
      <p>
        Only to reply to your inquiry, plan your wedding coverage if you book
        with us, and keep this website working well. We never sell your details,
        never add you to a mailing list without asking, and never use them for
        advertising.
      </p>
    ),
  },
  {
    title: "Cookies & storage",
    body: (
      <>
        <p>
          We do not use advertising or tracking cookies. Our site statistics are
          collected without cookies. Your browser stores a small note that you
          have seen our cookie notice, so it does not appear again.
        </p>
        <p>
          You can clear this at any time from your browser settings; the site
          will simply show the notice again.
        </p>
      </>
    ),
  },
  {
    title: "Who helps us",
    body: (
      <p>
        A few trusted services handle data on our behalf: Vercel hosts this
        website and provides its privacy-friendly statistics, and Resend
        delivers inquiry emails to our inbox. They process your details only to
        provide these services to us. Some of them operate outside India, with
        safeguards in place for those transfers.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        Inquiries that do not lead to a booking are deleted within two years. If
        you book with us, we keep what is needed for your contract, delivery of
        your photographs and films, and our legal and tax records.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        You can ask to see the details we hold about you, correct them, or have
        them deleted, and you can withdraw your consent at any time. These
        rights apply under India&rsquo;s Digital Personal Data Protection Act
        and, for couples in the UK and Europe, the GDPR. Email {email} and we
        will respond within 30 days.
      </p>
    ),
  },
  {
    title: "Changes",
    body: (
      <p>
        If we update this policy, the new version will appear on this page with
        a fresh date at the top.
      </p>
    ),
  },
];

/** The privacy policy, set like the rest of the site: numbered sections, display serif body. */
export default function PrivacyView() {
  return (
    <article className="px-3 pt-32 pr-10 pb-24 md:px-[5vw] md:pt-40 md:pr-24 md:pb-32">
      <header className="max-w-4xl">
        <p className={LEGEND}>Legal</p>
        <h1 className="mt-6 font-display text-[3.5rem] leading-[0.95] md:text-[min(7vw,13svh)]">
          Privacy <span className="italic">policy</span>
        </h1>
        <p className="mt-8 max-w-xl font-display text-xl leading-snug text-ink/75 md:text-2xl">
          Your story is personal. Here is, plainly, how we look after the
          details you share with us.
        </p>
        <p className={`${LEGEND} mt-8`}>Last updated {LAST_UPDATED}</p>
      </header>

      <ol className="mt-16 md:mt-24">
        {SECTIONS.map(({ title, body }, index) => (
          <li
            key={title}
            className="grid gap-4 border-t border-ink/15 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:py-12"
          >
            <h2 className="flex items-baseline gap-4 font-logo text-lg leading-none font-bold tracking-[-0.01em] uppercase md:text-xl">
              <span className="font-logo-sub text-[0.6875rem] tracking-[0.14em] text-ink/40 md:text-xs">
                {String(index + 1).padStart(2, "0")}
              </span>
              {title}
            </h2>
            <div className="max-w-2xl space-y-4 font-display text-lg leading-relaxed text-ink/75 md:text-xl">
              {body}
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-ink/15 pt-10 md:pt-14">
        <Link
          href={ROUTES.CONTACT}
          className="font-logo text-sm font-bold tracking-[0.04em] uppercase underline-offset-4 hover:underline"
        >
          Start your inquiry &rarr;
        </Link>
      </div>
    </article>
  );
}
