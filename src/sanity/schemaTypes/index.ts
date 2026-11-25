import type { SchemaTypeDefinition } from "sanity";
import { aboutPage } from "./aboutPage";
import { couple } from "./couple";
import { faqPage } from "./faqPage";
import { siteSettings } from "./siteSettings";
import { testimonialsPage } from "./testimonialsPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  couple,
  aboutPage,
  testimonialsPage,
  faqPage,
  siteSettings,
];
