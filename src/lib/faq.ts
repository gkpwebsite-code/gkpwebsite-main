/** Draft answers for the studio to confirm. The first four also appear on the inquiry page. */
export const FAQ = [
  {
    question: "How far in advance should we book?",
    answer:
      "Most couples write to us nine to twelve months ahead, especially for the November to February season. If your date is sooner, reach out anyway; we will always try.",
  },
  {
    question: "Do you travel for destination weddings?",
    answer:
      "Yes. We are based in India and photograph weddings across the country and abroad. Travel and stay are planned with you as part of your proposal.",
  },
  {
    question: "Can you cover every function?",
    answer:
      "From the Haldi and Mehendi to the Sangeet, wedding and reception, your proposal is built around the days and moments you want remembered.",
  },
  {
    question: "When will we receive our photographs?",
    answer:
      "A first preview within a week, and your complete, hand-edited gallery within six to eight weeks, delivered in a private online gallery.",
  },
  {
    question: "Do you also make films?",
    answer:
      "Yes. Films can be added to any proposal, from a short highlight to a full-length film of your celebrations, made by a team that works alongside ours.",
  },
  {
    question: "How many photographs will we receive?",
    answer:
      "There is no fixed number. We deliver every photograph that tells your story well, carefully selected and edited by hand, never padded with near-duplicates.",
  },
  {
    question: "Do you make wedding albums?",
    answer:
      "We do. Our heirloom albums are designed by us and handmade with archival papers and covers, so your story can be held and passed down.",
  },
  {
    question: "How do we secure our date?",
    answer:
      "Once you are happy with your proposal, a signed agreement and a booking retainer reserve your date. Until then, dates stay open to other couples.",
  },
] as const;

export type FaqItem = (typeof FAQ)[number];
