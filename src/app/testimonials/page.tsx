import type { Metadata } from "next";
import PlaceholderView from "@/components/pages/PlaceholderPage/PlaceholderView";

export const metadata: Metadata = {
  title: "Testimonials",
};

export default function Page() {
  return <PlaceholderView title="Testimonials" note="Kind words, coming soon" />;
}
