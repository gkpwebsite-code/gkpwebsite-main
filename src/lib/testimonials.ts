/** Draft words for the studio to replace with each couple's own. `slug` links to their gallery. */
export type Testimonial = {
  slug: string;
  /** The line set large; wrap a phrase in asterisks to set it in italics. */
  quote: string;
  body: string;
};

/** The opening line, lit word by word at the top of the page. */
export const FEATURED_QUOTE =
  "We didn\u2019t see Gautam all day, yet every photograph feels like he was *standing right beside us.*";

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    slug: "sharon-ishan",
    quote: "It felt like our day, *only slower,* so we could finally see it.",
    body: "Our families came from three countries and Gautam somehow made all of them feel at home. When the gallery arrived we sat on the floor and went through it twice, in silence.",
  },
  {
    slug: "sofia-harshil",
    quote: "He caught the moments *we didn\u2019t know* had happened.",
    body: "My grandmother fixing my dupatta, Harshil\u2019s brother crying during the pheras. We only found out these moments existed because of the photographs.",
  },
  {
    slug: "shivanee-rajat",
    quote: "Calm in the middle of *a very loud wedding.*",
    body: "Five functions, four hundred guests, and not once did we feel directed. He was simply there, quietly, and the pictures feel exactly like the days did.",
  },
  {
    slug: "inayat-jasdeep",
    quote: "Our parents still call the album *their favourite thing.*",
    body: "We booked Gautam for the photographs and gained a friend. The heirloom album sits on my mother\u2019s table and she shows it to every guest who visits.",
  },
  {
    slug: "sarika-zach",
    quote: "Every frame feels *like a memory,* not a pose.",
    body: "Zach\u2019s family had never been to an Indian wedding. Gautam\u2019s photographs tell the story of two families meeting for the first time, better than we ever could.",
  },
];
