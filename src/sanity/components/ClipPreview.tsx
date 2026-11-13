"use client";

import { useEffect, useState } from "react";
import type { PreviewProps } from "sanity";
import { useClient } from "sanity";

/** Tall video thumb so film clips are readable in the Studio grid. */
export function ClipPreview(props: PreviewProps) {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [url, setUrl] = useState<string | null>(null);
  const media = props.media as { _ref?: string } | undefined;
  const ref = media && typeof media === "object" ? media._ref : undefined;

  useEffect(() => {
    if (!ref) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    client
      .fetch<{ url?: string } | null>(`*[_id == $id][0]{ url }`, { id: ref })
      .then((asset) => {
        if (!cancelled) setUrl(asset?.url ?? null);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [client, ref]);

  return (
    <div className="gkp-clip-preview">
      {url ? (
        <video src={url} muted playsInline preload="metadata" />
      ) : (
        props.renderDefault(props)
      )}
    </div>
  );
}
