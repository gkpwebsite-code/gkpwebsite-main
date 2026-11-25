import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineArrayMember, defineField, defineType } from "sanity";

export const SITE_SETTINGS_ID = "siteSettings";

/** Contact details and social links: one place that feeds the footer, menu and inquiry page. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Contact & social links",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description:
        "Shown in the footer, the inquiry page and the privacy policy.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description:
        "Write it the way it should appear, e.g. +91 99109 97336. Tapping it on a phone dials it.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "basedIn",
      title: "Based in",
      type: "string",
      description:
        "Shown in the footer as “Based in …”. Just the place, e.g. India.",
    }),
    defineField({
      name: "availability",
      title: "Availability line",
      type: "string",
      description:
        "The italic line under “Based in”, e.g. Available worldwide.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      description:
        "Shown in the footer and the menu, in this order. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              description: "As it should appear, e.g. Instagram.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Link",
              type: "url",
              description:
                "The full address of your profile, e.g. https://www.instagram.com/yourname/",
              validation: (rule) =>
                rule.required().uri({ scheme: ["https", "http"] }),
            }),
          ],
          preview: { select: { title: "name", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact & social links" };
    },
  },
});
