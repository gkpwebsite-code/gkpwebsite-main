import type { Metadata } from "next";
import InquireView from "@/components/pages/InquirePage/InquireView";

export const metadata: Metadata = {
  title: "Inquire",
};

export default function Page() {
  return <InquireView />;
}
