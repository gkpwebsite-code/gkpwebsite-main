import { HeartIcon } from "@sanity/icons/Heart";
import {
  defineArrayMember,
  defineField,
  defineType,
  type PreviewValue,
} from "sanity";
import { ClipPreview } from "../components/ClipPreview";
import { LargeMediaField } from "../components/LargeMediaField";
import { MediaArrayInput } from "../components/MediaArrayInput";

/** Turns seed filenames like `images__…__24.jpg` into a short label. */
function shortName(filename?: string) {
  if (!filename) return "Image";
  const parts = filename.split("__");
  return parts[parts.length - 1] || filename;
}

/**
 * One wedding story: the portfolio tile, the full gallery, and optional film clips.
 * Aim for 3–4 cover stills; clips are optional and only some couples will have them.
 * Categories are omitted until a filter UX is decided — existing category data stays in the dataset.
 */
export const couple = defineType({
  name: "couple",
  title: "Couple",
  icon: HeartIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Couple names",
      type: "string",
      description: 'e.g. "Sharon & Ishan"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      initialValue: "The Wedding of",
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City / place",
      type: "string",
      description: "Shown in “Where we’ve been”.",
    }),
    defineField({
      name: "placeBackground",
      title: "Places background",
      type: "image",
      description:
        "One landscape still for desktop hover on “Where we’ve been”. Leave empty until you pick it. Mobile stays black (no hover).",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first in the portfolio grid.",
      initialValue: 100,
    }),
    defineField({
      name: "cover",
      title: "Primary still",
      type: "image",
      description:
        "The one hero photo for this couple: social-share preview, text Index hover, and the first tile image if no portfolio covers are set yet.",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "covers",
      title: "Portfolio tile covers",
      type: "array",
      description:
        "3–4 of the strongest stills. These shuffle with any clips on each page load. Use “Upload multiple…” or drop several images at once.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          preview: {
            select: {
              media: "asset",
              filename: "asset.originalFilename",
            },
            prepare({ media, filename }) {
              return {
                title: shortName(filename),
                media,
              };
            },
          },
        }),
      ],
      options: { layout: "grid" },
      components: { field: LargeMediaField, input: MediaArrayInput },
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "clips",
      title: "Film clips",
      type: "array",
      description:
        "Short muted portrait clips (MP4). Optional — only add when you have them. Use “Upload multiple…” or drop several files at once.",
      of: [
        defineArrayMember({
          type: "file",
          options: { accept: "video/*" },
          components: { preview: ClipPreview },
          preview: {
            select: {
              ref: "asset._ref",
              filename: "asset.originalFilename",
            },
            prepare({ ref, filename }) {
              return {
                title: shortName(filename),
                // Pass the asset id through so ClipPreview can load a video thumb. It isn't a
                // normal media value, hence the cast; ClipPreview reads `_ref` back out.
                media: (ref
                  ? { _ref: ref }
                  : undefined) as unknown as PreviewValue["media"],
              };
            },
          },
        }),
      ],
      options: { layout: "grid" },
      components: { field: LargeMediaField, input: MediaArrayInput },
    }),
    defineField({
      name: "images",
      title: "Gallery photographs",
      type: "array",
      description:
        "The full story — typically 25–30 photographs. Use “Upload multiple…” or drop several images at once.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          preview: {
            select: {
              media: "asset",
              filename: "asset.originalFilename",
            },
            prepare({ media, filename }) {
              return {
                title: shortName(filename),
                media,
              };
            },
          },
        }),
      ],
      options: { layout: "grid" },
      components: { field: LargeMediaField, input: MediaArrayInput },
    }),
  ],
  preview: {
    select: {
      title: "title",
      city: "city",
      media: "cover",
    },
    prepare({ title, city, media }) {
      return {
        title: title || "Untitled couple",
        subtitle: city || "Place TBD",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
