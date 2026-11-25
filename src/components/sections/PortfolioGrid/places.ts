import type { Gallery } from "@/lib/constants";

/** Place label for “Where we’ve been” — uses each couple’s City from Sanity / galleries. */
export function placeOf(gallery: Gallery) {
  const city = gallery.city?.trim();
  if (city && city !== "City") return city;
  return "Somewhere beautiful";
}
