import type { Metadata } from "next";
import InquireView from "@/components/pages/InquirePage/InquireView";
import { getFaq } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Inquire",
};

export default async function Page() {
  return <InquireView faq={await getFaq()} />;
}
