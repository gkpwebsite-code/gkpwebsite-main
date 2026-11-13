import type { Metadata } from "next";
import LogoView from "@/components/pages/LogoPage/LogoView";

export const metadata: Metadata = {
  title: "Logo Variations",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LogoView />;
}
