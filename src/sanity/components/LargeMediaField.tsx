"use client";

import type { FieldProps } from "sanity";

/** Wraps media arrays so Studio CSS can enlarge the grid thumbnails. */
export function LargeMediaField(props: FieldProps) {
  return (
    <div className="gkp-large-media-field" data-field={props.schemaType.name}>
      {props.renderDefault(props)}
    </div>
  );
}
