import type { Metadata } from "next";
import TestimonialsView from "@/components/pages/TestimonialsPage/TestimonialsView";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Couples photographed by Gautam Khullar Photography, in their own words.",
};

export default function Page() {
  return <TestimonialsView />;
}
