"use client";

import { usePathname } from "next/navigation";

/**
 * Fades each new page in. Opacity only: a transform here would re-anchor the fixed controls
 * inside pages, and a view transition would snapshot the header and freeze the logo's glide.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
