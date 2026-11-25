"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/site-settings";

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

/** Hands the contact details and social links edited in Sanity to the site's client parts. */
export default function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/** Email, phone, place, availability line and social links. */
export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
