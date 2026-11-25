import { ImagesIcon } from "@sanity/icons/Images";
import { defineArrayMember, defineField, defineType } from "sanity";
import { LargeMediaField } from "../components/LargeMediaField";
import { MediaArrayInput } from "../components/MediaArrayInput";

/** Photos for the About page. A single document: there is only one About page. */
export const ABOUT_PAGE_ID = "aboutPage";
export const ABOUT_PHOTO_LIMIT = 5;

const photo = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  preview: {
    select: { media: "asset", filename: "asset.originalFilename" },
    prepare({ media, filename }) {
      return { title: filename || "Photo", media };
    },
  },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "heroImages",
      title: "Opening photos",
      type: "array",
      description: `Up to ${ABOUT_PHOTO_LIMIT} photos behind the big “About us.” title; they crossfade in this order. Any shape: landscape fills the screen, portrait shows whole at full height on wide screens. Click a photo → “Edit hotspot” to choose what stays in frame. Leave empty to use random landscape photos from the couples.`,
      of: [photo],
      options: { layout: "grid" },
      components: { field: LargeMediaField, input: MediaArrayInput },
      validation: (rule) => rule.max(ABOUT_PHOTO_LIMIT),
    }),
    defineField({
      name: "reelImages",
      title: "Full-screen photos (optional, landscape only)",
      type: "array",
      description: `Up to ${ABOUT_PHOTO_LIMIT} landscape photos that open out full-screen after “Our approach”, in this order. Landscape only, so each fills the screen whole and sharp. Leave empty to show random landscape photos from 4 different couples on each visit.`,
      of: [photo],
      options: { layout: "grid" },
      components: { field: LargeMediaField, input: MediaArrayInput },
      validation: (rule) =>
        rule.max(ABOUT_PHOTO_LIMIT).custom(async (items, context) => {
          const refs = (items ?? [])
            .map((item) => (item as { asset?: { _ref?: string } }).asset?._ref)
            .filter((ref): ref is string => Boolean(ref));
          if (refs.length === 0) return true;
          const sizes = await context
            .getClient({ apiVersion: "2025-01-01" })
            .fetch<{ _id: string; w: number; h: number }[]>(
              `*[_id in $refs]{ _id, "w": metadata.dimensions.width, "h": metadata.dimensions.height }`,
              { refs },
            );
          const portrait = sizes.filter(({ w, h }) => h >= w).length;
          return portrait === 0
            ? true
            : `${portrait} photo${portrait > 1 ? "s are" : " is"} portrait or square. This section needs landscape photos (wider than tall).`;
        }),
    }),
  ],
  preview: {
    prepare() {
      return { title: "About page" };
    },
  },
});
