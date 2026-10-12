import type { Metadata } from "next";
import PrivacyView from "@/components/pages/LegalPage/PrivacyView";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Gautam Khullar Photography collects, uses and protects the details you share through this website.",
};

export default function Page() {
  return <PrivacyView />;
}
