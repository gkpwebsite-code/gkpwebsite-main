/**
 * Fills the new Sanity pages with the text the site shows today, so they open ready to edit
 * instead of empty: Contact & social links, Testimonials, FAQ (and an empty About page).
 *
 * Usage:
 *   npm run seed:content
 *
 * Safe to re-run: each page is only created if it doesn't exist yet. Anything already edited
 * in Sanity is never overwritten.
 */
import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONTACT_DETAILS, SOCIAL_LINKS } from "../src/lib/constants.ts";
import { FAQ } from "../src/lib/faq.ts";
import { FEATURED_QUOTE, TESTIMONIALS } from "../src/lib/testimonials.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv(key) {
  const file = path.join(root, ".env.local");
  if (!existsSync(file)) return "";
  const line = readFileSync(file, "utf8")
    .split("\n")
    .find((row) => row.startsWith(`${key}=`));
  return line
    ? line
        .slice(key.length + 1)
        .trim()
        .replace(/^"|"$/g, "")
    : "";
}

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  loadEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  loadEnv("NEXT_PUBLIC_SANITY_DATASET") ||
  "production";
const token = process.env.SANITY_API_TOKEN || loadEnv("SANITY_API_TOKEN");

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const key = () => Math.random().toString(36).slice(2, 14);

// Testimonials point at the couples already in Sanity, matched by their web address (slug).
const couples = await client.fetch(
  `*[_type == "couple" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current }`,
);
const coupleId = new Map(couples.map(({ _id, slug }) => [slug, _id]));

const docs = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    email: CONTACT_DETAILS.email,
    phone: CONTACT_DETAILS.phone,
    basedIn: CONTACT_DETAILS.city,
    availability: "Available worldwide",
    socialLinks: SOCIAL_LINKS.map(({ name, href }) => ({
      _key: key(),
      _type: "socialLink",
      name,
      url: href,
    })),
  },
  {
    _id: "testimonialsPage",
    _type: "testimonialsPage",
    featuredQuote: FEATURED_QUOTE,
    testimonials: TESTIMONIALS.filter(({ slug }) => coupleId.has(slug)).map(
      ({ slug, quote, body }) => ({
        _key: key(),
        _type: "testimonial",
        couple: { _type: "reference", _ref: coupleId.get(slug) },
        quote,
        body,
      }),
    ),
  },
  {
    _id: "faqPage",
    _type: "faqPage",
    questions: FAQ.map(({ question, answer }) => ({
      _key: key(),
      _type: "faqItem",
      question,
      answer,
    })),
  },
  { _id: "aboutPage", _type: "aboutPage" },
];

const tx = client.transaction();
for (const doc of docs) tx.createIfNotExists(doc);
await tx.commit();

const missing = TESTIMONIALS.filter(({ slug }) => !coupleId.has(slug));
console.log(
  `Done: ${docs.map((d) => d._id).join(", ")} (created where missing; existing ones left untouched).`,
);
if (missing.length)
  console.log(
    `Skipped testimonials for couples not in Sanity: ${missing.map((t) => t.slug).join(", ")}`,
  );
