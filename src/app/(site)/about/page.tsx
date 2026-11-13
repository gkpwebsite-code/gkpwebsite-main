import type { Metadata } from "next";
import AboutView from "@/components/pages/AboutPage/AboutView";

export const metadata: Metadata = {
  title: "About",
};

export default function Page() {
  return <AboutView />;
}
