import { SITE_NAME, SITE_SHORT_NAME } from "@/lib/constants";
import { INQUIRY_FIELDS } from "@/lib/inquiry";
import { colors } from "@/lib/theme";

const INK = colors.ink;
const MUTED = colors.muted;
const MIST = colors.mist;
const PAPER = colors.paper;

/** Public HTTPS origin that serves `/fonts/*` (not localhost — mail clients must fetch them). */
function fontOrigin() {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site?.startsWith("https://")) return site;
  return "https://gkpwebsite-main.vercel.app";
}

const FONT = {
  logo: `'GK Logo', Helvetica Neue, Helvetica, Arial, sans-serif`,
  logoSub: `'GK Logo Sub', Helvetica Neue, Helvetica, Arial, sans-serif`,
  display: `'GK Display', Georgia, 'Times New Roman', serif`,
} as const;

/** Form chapters — same grouping as the inquire page. */
const CHAPTERS: {
  title: string;
  fields: readonly (typeof INQUIRY_FIELDS)[number][0][];
}[] = [
  {
    title: "About you",
    fields: ["name", "email", "phone", "location", "role"],
  },
  {
    title: "Your celebration",
    fields: ["eventType", "dateFrom", "dateTo", "venue", "coverage"],
  },
  {
    title: "Your story",
    fields: ["heardFrom", "instagram", "message"],
  },
];

const LABELS = Object.fromEntries(INQUIRY_FIELDS) as Record<
  (typeof INQUIRY_FIELDS)[number][0],
  string
>;

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fieldBlock(label: string, value: string) {
  return `
    <tr>
      <td style="padding:20px 0 0;border-top:1px solid rgba(10,10,10,0.15)">
        <p style="margin:0 0 10px;font-family:${FONT.logoSub};font-size:11px;line-height:1;letter-spacing:0.18em;text-transform:uppercase;color:rgba(10,10,10,0.4)">${escapeHtml(label)}</p>
        <p style="margin:0;font-family:${FONT.logo};font-size:18px;line-height:1.35;font-weight:700;letter-spacing:-0.01em;color:${INK};white-space:pre-wrap">${escapeHtml(value)}</p>
      </td>
    </tr>`;
}

function fontFaceCss(origin: string) {
  return `
    @font-face {
      font-family: 'GK Logo';
      src: url('${origin}/fonts/forma-djr-micro/forma-djr-micro-bold.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'GK Logo Sub';
      src: url('${origin}/fonts/forma-djr-banner/forma-djr-banner-regular.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'GK Display';
      src: url('${origin}/fonts/silk-serif/silk-serif-regular.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'GK Display';
      src: url('${origin}/fonts/silk-serif/silk-serif-italic.woff2') format('woff2');
      font-weight: 400;
      font-style: italic;
      font-display: swap;
    }
  `;
}

/**
 * HTML for the studio inbox — same logo, inquire title and field chrome as the site.
 * Custom fonts load in Apple Mail / iOS; Gmail falls back to Helvetica / Georgia.
 */
export function buildInquiryEmailHtml(
  values: Record<(typeof INQUIRY_FIELDS)[number][0], string>,
) {
  const origin = fontOrigin();
  const chapters = CHAPTERS.map((chapter) => {
    const rows = chapter.fields
      .filter((name) => values[name])
      .map((name) => fieldBlock(LABELS[name], values[name]))
      .join("");
    if (!rows) return "";
    return `
      <tr>
        <td style="padding:40px 0 4px">
          <p style="margin:0;font-family:${FONT.logoSub};font-size:11px;line-height:1;letter-spacing:0.14em;text-transform:uppercase;color:rgba(10,10,10,0.45)">${chapter.title}</p>
        </td>
      </tr>
      ${rows}`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New inquiry</title>
  <!--[if mso]><style>body,table,td{font-family:Arial,sans-serif!important}</style><![endif]-->
  <style type="text/css">${fontFaceCss(origin)}</style>
</head>
<body style="margin:0;padding:0;background:${MIST};color:${INK};-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">
    New inquiry from ${escapeHtml(values.name || "a couple")} · ${escapeHtml(SITE_NAME)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${MIST};padding:40px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${PAPER};padding:48px 36px 40px">
          <tr>
            <td align="center" style="padding:0 0 40px">
              <p style="margin:0;font-family:${FONT.logo};font-size:28px;line-height:1;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${INK}">
                ${escapeHtml(SITE_SHORT_NAME)}
              </p>
              <p style="margin:6px 0 0;font-family:${FONT.logoSub};font-size:10px;line-height:1;font-weight:400;letter-spacing:0.15em;text-transform:uppercase;color:${INK}">
                Photography
              </p>
            </td>
          </tr>

          <tr>
            <td>
              <p style="margin:0 0 20px;font-family:${FONT.logoSub};font-size:11px;line-height:1;letter-spacing:0.14em;text-transform:uppercase;color:rgba(10,10,10,0.45)">
                Inquire
              </p>
              <h1 style="margin:0;width:100%;font-family:${FONT.display};font-size:56px;line-height:1.12;font-weight:400;color:${INK}">
                <span style="display:block">Begin with</span>
                <span style="display:block;padding-top:0.12em;font-style:italic">hello.</span>
              </h1>
              <p style="margin:28px 0 0;width:100%;font-family:${FONT.display};font-size:20px;line-height:1.4;color:rgba(10,10,10,0.75)">
                Every wedding we photograph begins with a conversation. A couple wrote in from the site.
              </p>
            </td>
          </tr>

          ${chapters}

          <tr>
            <td style="padding:40px 0 0;border-top:1px solid rgba(10,10,10,0.15)">
              <p style="margin:0;font-family:${FONT.logoSub};font-size:11px;line-height:1.55;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED}">
                Reply to write back to ${escapeHtml(values.name || "the couple")}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
