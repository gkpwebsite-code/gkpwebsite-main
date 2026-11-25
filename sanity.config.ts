"use client";

import { HeartIcon } from "@sanity/icons/Heart";
import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import "./src/sanity/studio.css";

const id = projectId || "placeholder";

/**
 * Page-level documents that exist exactly once: opened straight from the menu, never created,
 * duplicated or deleted. The document id matches the type name.
 */
const SINGLETONS = new Set([
  "aboutPage",
  "testimonialsPage",
  "faqPage",
  "siteSettings",
]);

/** A menu entry that opens the one document of this type directly. */
function singleton(S: StructureBuilder, type: string, title: string) {
  return S.documentTypeListItem(type)
    .id(type)
    .title(title)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

export default defineConfig({
  name: "gkp",
  title: "Gautam Khullar Photography",
  projectId: id,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      title: "Website",
      structure: (S) =>
        S.list()
          .title("Website")
          .items([
            S.documentTypeListItem("couple")
              .title("Couples (portfolio & galleries)")
              .icon(HeartIcon),
            S.divider().title("Pages"),
            singleton(S, "aboutPage", "About page"),
            singleton(S, "testimonialsPage", "Testimonials"),
            singleton(S, "faqPage", "FAQ"),
            S.divider().title("Everywhere on the site"),
            singleton(S, "siteSettings", "Contact & social links"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Hide singletons from “Create new…”.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    // No duplicate, delete or unpublish for singletons.
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(
            ({ action }) =>
              action !== "duplicate" &&
              action !== "delete" &&
              action !== "unpublish",
          )
        : actions,
  },
});
