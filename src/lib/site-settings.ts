import {
  CONTACT_DETAILS,
  SOCIAL_LINKS,
  type SocialLink,
} from "@/lib/constants";

/** Contact details and social links, edited in Sanity under “Contact & social links”. */
export type SiteSettings = {
  email: string;
  phone: string;
  basedIn: string;
  availability: string;
  socialLinks: readonly SocialLink[];
};

/** The built-in values, used until Sanity has them (safe to import in the browser). */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: CONTACT_DETAILS.email,
  phone: CONTACT_DETAILS.phone,
  basedIn: CONTACT_DETAILS.city,
  availability: "Available worldwide",
  socialLinks: SOCIAL_LINKS,
};

/** `tel:` link for a phone number written for people. */
export const phoneHref = (phone: string) =>
  `tel:${phone.replace(/[^\d+]/g, "")}`;
