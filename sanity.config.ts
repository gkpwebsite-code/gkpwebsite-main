"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import "./src/sanity/studio.css";

const id = projectId || "placeholder";

export default defineConfig({
  name: "gkp",
  title: "Gautam Khullar Photography",
  projectId: id,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
