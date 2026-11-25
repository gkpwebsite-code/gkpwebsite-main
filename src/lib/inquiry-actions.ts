"use server";

import {
  DATES_UNDECIDED,
  INQUIRY_FIELDS,
  validateInquiry,
  type InquiryState,
} from "@/lib/inquiry";
import { buildInquiryEmailHtml } from "@/lib/inquiry-email";

const MAX_LENGTH = 5000;

function readField(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((value) => String(value).trim().slice(0, MAX_LENGTH))
    .filter(Boolean)
    .join(", ");
}

/** Emails a couple's inquiry to the studio through Resend; replies go straight to the couple. */
export async function sendInquiry(
  _previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  // Bots fill every field, including this one that people never see.
  if (readField(formData, "company")) return { status: "sent" };

  const values = Object.fromEntries(
    INQUIRY_FIELDS.map(([name]) => [name, readField(formData, name)]),
  ) as Record<(typeof INQUIRY_FIELDS)[number][0], string>;

  if (Object.keys(validateInquiry(formData)).length > 0) {
    return {
      status: "error",
      message: "Please add your names, a valid email and tick the consent box.",
    };
  }
  if (values.phone)
    values.phone = `${readField(formData, "phoneCode")} ${values.phone}`.trim();
  if (formData.get("datesUndecided")) values.dateFrom = DATES_UNDECIDED;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV === "development") {
      console.info("[inquiry] Resend is not configured; would send:", values);
      return { status: "sent" };
    }
    return {
      status: "error",
      message: "Something went wrong. Please email us directly instead.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to
        .split(",")
        .map((address) => address.trim())
        .filter(Boolean),
      reply_to: values.email,
      subject: `New inquiry — ${values.name}${values.dateFrom ? ` · ${values.dateFrom}` : ""}`,
      html: buildInquiryEmailHtml(values),
    }),
  });

  if (!response.ok) {
    console.error("[inquiry] Resend failed:", await response.text());
    return {
      status: "error",
      message: "Something went wrong. Please email us directly instead.",
    };
  }
  return { status: "sent" };
}
