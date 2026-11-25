import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { defineArrayMember, defineField, defineType } from "sanity";

export const FAQ_PAGE_ID = "faqPage";

/** Questions and answers for the FAQ page; the first four also appear on the inquiry page. */
export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      description:
        "Shown in this order; drag to reorder. The first four also appear at the bottom of the inquiry page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "FAQ" };
    },
  },
});
