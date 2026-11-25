import { notFound } from "next/navigation";

/**
 * Catches any address no other page claims, so it gets the site's own 404 (inside the site
 * layout, with the header and footer) instead of the bare root-level one.
 */
export default function MissingPage() {
  notFound();
}
