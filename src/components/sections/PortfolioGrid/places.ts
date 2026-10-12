import type { Gallery } from "@/lib/constants";

/** Stand-in places for the trial, used until each gallery's real `city` is filled in. */
const SAMPLE_PLACES: Record<string, string> = {
  "sharon-ishan": "Jaipur",
  "sofia-harshil": "Lake Como",
  "sharanya-vinay": "Udaipur",
  "nabeiha-zuber": "Jodhpur",
  "shivanee-rajat": "Goa",
  "inayat-jasdeep": "New Delhi",
  "sanjana-shrey": "Mussoorie",
  "sarika-zach": "Tuscany",
  "hunar-noor": "Jaipur",
  "saachi-jay": "London",
  "nikita-abhinav": "Udaipur",
  "annushka-karan": "Bali",
};

export function placeOf(gallery: Gallery) {
  return gallery.city !== "City"
    ? gallery.city
    : (SAMPLE_PLACES[gallery.slug] ?? "Somewhere beautiful");
}
