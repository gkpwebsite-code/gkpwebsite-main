"use client";

import { UploadIcon } from "@sanity/icons/Upload";
import { Button, Flex, Stack, Text } from "@sanity/ui";
import { useToast } from "@sanity/ui/toast";
import { useCallback, useRef, useState } from "react";
import {
  ArrayOfObjectsFunctions,
  useClient,
  type ArrayInputFunctionsProps,
  type ArrayOfObjectsInputProps,
  type ObjectItem,
  type ObjectSchemaType,
} from "sanity";

function itemKey() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

/** Upload caps per field, so “Upload multiple…” can't overfill a limited list. */
const FIELD_LIMITS: Record<string, number> = {
  covers: 4,
  heroImages: 5,
  reelImages: 5,
};

function fieldLimit(path: ArrayOfObjectsInputProps["path"]) {
  const leaf = path[path.length - 1];
  return typeof leaf === "string" ? FIELD_LIMITS[leaf] : undefined;
}

/**
 * Image/file arrays with a working multi-select upload:
 * picks files → uploads to the asset CDN → appends each item to the array.
 */
export function MediaArrayInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: "2025-01-01" });
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const memberType = props.schemaType.of[0] as ObjectSchemaType | undefined;
  const isFile = memberType?.name === "file";
  const accept = isFile ? "video/mp4,video/*,.mp4" : "image/*";
  const currentCount = props.value?.length ?? 0;
  const limit = fieldLimit(props.path);
  const full = limit !== undefined && currentCount >= limit;

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!memberType || props.readOnly || files.length === 0) return;

      const room =
        limit === undefined ? files.length : Math.max(0, limit - currentCount);
      const queue = files.slice(0, room);
      if (limit !== undefined && files.length > room) {
        toast.push({
          status: "warning",
          title:
            room === 0
              ? `Already at the max of ${limit}.`
              : `Only ${room} more slot${room === 1 ? "" : "s"} (max ${limit}).`,
        });
      }
      if (queue.length === 0) return;

      setBusy(true);
      let ok = 0;
      try {
        for (const file of queue) {
          const asset = await client.assets.upload(
            isFile ? "file" : "image",
            file,
            { filename: file.name },
          );
          // Built first, then passed: the item type only declares `_key`, but Sanity needs
          // `_type` and the asset reference too.
          const item = {
            _type: memberType.name,
            _key: itemKey(),
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          };
          props.onItemAppend(item);
          ok += 1;
        }
        toast.push({
          status: "success",
          title: ok === 1 ? "Uploaded 1 file" : `Uploaded ${ok} files`,
        });
      } catch (error) {
        toast.push({
          status: "error",
          title: "Upload failed",
          description:
            error instanceof Error ? error.message : "Could not upload files.",
        });
      } finally {
        setBusy(false);
      }
    },
    [client, currentCount, isFile, limit, memberType, props, toast],
  );

  const onPick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = "";
      void uploadFiles(files);
    },
    [uploadFiles],
  );

  return (
    <Stack gap={3}>
      {/* Stable file input outside the array chrome so the ref never remounts. */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={onPick}
        tabIndex={-1}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      {props.renderDefault({
        ...props,
        arrayFunctions: (
          fnProps: ArrayInputFunctionsProps<
            ObjectItem,
            ArrayOfObjectsInputProps["schemaType"]
          >,
        ) => (
          <Flex gap={2} wrap="wrap" align="center">
            <ArrayOfObjectsFunctions {...fnProps} />
            {!props.readOnly && (
              <Button
                icon={UploadIcon}
                mode="ghost"
                text={busy ? "Uploading…" : "Upload multiple…"}
                disabled={busy || full}
                onClick={openPicker}
              />
            )}
          </Flex>
        ),
      })}
      {busy && (
        <Text size={1} muted>
          Uploading — keep this document open until it finishes.
        </Text>
      )}
    </Stack>
  );
}
