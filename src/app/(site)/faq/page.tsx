import type { Metadata } from "next";
import FaqView from "@/components/pages/FaqPage/FaqView";
import { getFaq } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Booking, travel, coverage, delivery and albums: the questions couples ask Gautam Khullar Photography most.",
};

export default async function Page() {
  return <FaqView questions={await getFaq()} />;
}
