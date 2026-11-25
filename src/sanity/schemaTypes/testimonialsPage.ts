import { CommentIcon } from "@sanity/icons/Comment";
import { defineArrayMember, defineField, defineType } from "sanity";

export const TESTIMONIALS_PAGE_ID = "testimonialsPage";

const ITALICS_TIP = "Put *stars* around a phrase to set it in italics.";

/** The Testimonials page: a featured line, then one chapter per couple. */
export const testimonialsPage = defineType({
  name: "testimonialsPage",
  title: "Testimonials",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "featuredQuote",
      title: "Big opening quote",
      type: "text",
      rows: 3,
      description: `The large line near the top of the page. ${ITALICS_TIP}`,
    }),
    defineField({
      name: "testimonials",
      title: "Couples’ words",
      type: "array",
      description:
        "One per couple, shown down the page in this order. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "testimonial",
          fields: [
            defineField({
              name: "couple",
              title: "Couple",
              type: "reference",
              to: [{ type: "couple" }],
              description:
                "Their names, photo and “View their story” link come from this couple.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quote",
              title: "Headline quote",
              type: "text",
              rows: 2,
              description: `A short line, set large. ${ITALICS_TIP}`,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Their words",
              type: "text",
              rows: 4,
              description: "A few sentences in the couple’s own words.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "photo",
              title: "Photo (optional)",
              type: "image",
              options: { hotspot: true },
              description:
                "Leave empty to use the couple’s main photo. Portrait works best.",
            }),
          ],
          preview: {
            select: {
              title: "couple.title",
              subtitle: "quote",
              media: "photo",
              coupleMedia: "couple.cover",
            },
            prepare({ title, subtitle, media, coupleMedia }) {
              return {
                title: title || "Choose a couple",
                subtitle: subtitle?.replace(/\*/g, ""),
                media: media || coupleMedia,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Testimonials" };
    },
  },
});
