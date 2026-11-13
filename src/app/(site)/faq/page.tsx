import type { Metadata } from "next";
import FaqView from "@/components/pages/FaqPage/FaqView";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Booking, travel, coverage, delivery and albums: the questions couples ask Gautam Khullar Photography most.",
};

export default function Page() {
  return <FaqView />;
}
