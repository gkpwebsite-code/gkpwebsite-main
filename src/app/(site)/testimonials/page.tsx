import type { Metadata } from "next";
import TestimonialsView from "@/components/pages/TestimonialsPage/TestimonialsView";
import { getTestimonials } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Couples photographed by Gautam Khullar Photography, in their own words.",
};

export default async function Page() {
  return <TestimonialsView content={await getTestimonials()} />;
}
