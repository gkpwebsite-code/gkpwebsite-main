import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  // Read straight from Sanity, not its CDN: pages are only fetched when they're built or
  // refreshed after a Publish, and the CDN can lag a few seconds behind a fresh publish.
  useCdn: false,
});
