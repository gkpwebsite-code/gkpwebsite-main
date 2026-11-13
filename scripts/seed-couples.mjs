/**
 * Uploads every local portfolio couple (covers, clips, gallery stills) into Sanity.
 *
 * Usage:
 *   SANITY_API_TOKEN=… node scripts/seed-couples.mjs
 *
 * Re-runs are safe: assets are reused by unique filename, documents upserted by slug.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  loadEnv("NEXT_PUBLIC_SANITY_PROJECT_ID") ||
  "rpgft93q";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  loadEnv("NEXT_PUBLIC_SANITY_DATASET") ||
  "production";
const token =
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_AUTH_TOKEN ||
  loadEnv("SANITY_API_TOKEN") ||
  readCliToken();

if (!token) {
  console.error(
    "Missing SANITY_API_TOKEN. Create one at https://www.sanity.io/manage → API → Tokens (Editor).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const COVERS = "images/cover-Portfolio-Images";
const WEDDINGS = "images/couples-wedding-folder";
const CLIPS = "videoClips";

const CITIES = {
  "sharon-ishan": "Jaipur",
  "sofia-harshil": "Lake Como",
  "sharanya-vinay": "Udaipur",
  "nabeiha-zuber": "Jodhpur",
  "shivanee-rajat": "Goa",
  "inayat-jasdeep": "New Delhi",
  "sanjana-shrey": "Mussoorie",
  "sarika-zach": "Tuscany",
  "hunar-noor": "Jaipur",
  "saachi-jay": "London",
  "nikita-abhinav": "Udaipur",
  "annushka-karan": "Bali",
};

/** Mirrors the site’s current GALLERIES list. */
const COUPLES = [
  {
    slug: "sharon-ishan",
    title: "Sharon & Ishan",
    cover: `${COVERS}/sharonIshan.jpg`,
    covers: [
      `${WEDDINGS}/sharon-ishan/24.jpg`,
      `${WEDDINGS}/sharon-ishan/20.jpg`,
      `${WEDDINGS}/sharon-ishan/3.jpg`,
      `${WEDDINGS}/sharon-ishan/14.jpg`,
    ],
    images: [
      "2.jpg",
      "2SH.jpg",
      "3.jpg",
      "3SH.jpg",
      "4SH.jpg",
      "6.jpg",
      "6SH.jpg",
      "8SH.jpg",
      "9SH.jpg",
      "10.jpg",
      "11.jpg",
      "12.jpg",
      "13.jpg",
      "14.jpg",
      "16.jpg",
      "17.jpg",
      "18.jpg",
      "19.jpg",
      "20.jpg",
      "20SH.jpg",
      "21.jpg",
      "22.jpg",
      "22SH.jpg",
      "23.jpg",
      "23SH.jpg",
      "24.jpg",
      "24SH.jpg",
      "25SH.jpg",
      "26SH.jpg",
      "28SH.jpg",
      "29SH.jpg",
      "1118SH.jpg",
      "2111SH.jpg",
    ].map((file) => `${WEDDINGS}/sharon-ishan/${file}`),
  },
  {
    slug: "sofia-harshil",
    title: "Sofia & Harshil",
    cover: `${COVERS}/SofiaHarshil.jpg`,
    covers: [`${COVERS}/SofiaHarshil.jpg`],
    clips: [`${CLIPS}/SofiyaHarshil.mp4`, `${CLIPS}/SofiyaHarshil2.mp4`],
    images: [],
  },
  {
    slug: "sharanya-vinay",
    title: "Sharanya & Vinay",
    cover: `${COVERS}/sharanyavinay.jpg`,
    covers: [`${COVERS}/sharanyavinay.jpg`],
    images: [],
  },
  {
    slug: "nabeiha-zuber",
    title: "Nabeiha & Zuber",
    cover: `${COVERS}/nabeihazuberwedding.jpg`,
    covers: [`${COVERS}/nabeihazuberwedding.jpg`],
    clips: [`${CLIPS}/nahibaZuber.mp4`, `${CLIPS}/nahibaZuber2.mp4`],
    images: [],
  },
  {
    slug: "shivanee-rajat",
    title: "Shivanee & Rajat",
    cover: `${COVERS}/shivaneerajat.jpg`,
    covers: [`${COVERS}/shivaneerajat.jpg`],
    images: [],
  },
  {
    slug: "inayat-jasdeep",
    title: "Inayat & Jasdeep",
    cover: `${COVERS}/inayatjasdeep.jpg`,
    covers: [`${COVERS}/inayatjasdeep.jpg`],
    images: [],
  },
  {
    slug: "sanjana-shrey",
    title: "Sanjana & Shrey",
    cover: `${COVERS}/sanjana-shrey.jpg`,
    covers: [`${COVERS}/sanjana-shrey.jpg`],
    images: [],
  },
  {
    slug: "sarika-zach",
    title: "Sarika & Zach",
    cover: `${COVERS}/sarika-zach.jpg`,
    covers: [`${COVERS}/sarika-zach.jpg`],
    images: [],
  },
  {
    slug: "hunar-noor",
    title: "Hunar & Noor",
    cover: `${COVERS}/hunar-noor.jpg`,
    covers: [`${COVERS}/hunar-noor.jpg`],
    images: [],
  },
  {
    slug: "saachi-jay",
    title: "Saachi & Jay",
    cover: `${COVERS}/saachi-jay.jpg`,
    covers: [`${COVERS}/saachi-jay.jpg`],
    images: [],
  },
  {
    slug: "nikita-abhinav",
    title: "Nikita & Abhinav",
    cover: `${COVERS}/nikita-abhinav.jpg`,
    covers: [`${COVERS}/nikita-abhinav.jpg`],
    images: [],
  },
  {
    slug: "annushka-karan",
    title: "Annushka & Karan",
    cover: `${COVERS}/annushka-karan.jpg`,
    covers: [`${COVERS}/annushka-karan.jpg`],
    images: [],
  },
];

function loadEnv(key) {
  const file = path.join(root, ".env.local");
  if (!existsSync(file)) return "";
  const line = readFileSync(file, "utf8")
    .split("\n")
    .find((row) => row.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1).trim() : "";
}

function readCliToken() {
  const file = path.join(process.env.HOME || "", ".config/sanity/config.json");
  if (!existsSync(file)) return "";
  try {
    const config = JSON.parse(readFileSync(file, "utf8"));
    return config.authToken || config.token || "";
  } catch {
    return "";
  }
}

function publicPath(relative) {
  return path.join(publicDir, relative);
}

function uniqueName(relative) {
  return relative.replaceAll("/", "__");
}

async function assetRef(kind, relative) {
  const absolute = publicPath(relative);
  if (!existsSync(absolute)) {
    throw new Error(`Missing file: ${relative}`);
  }
  const filename = uniqueName(relative);
  const type = kind === "image" ? "sanity.imageAsset" : "sanity.fileAsset";
  const existing = await client.fetch(
    `*[_type == $type && originalFilename == $filename][0]._id`,
    { type, filename },
  );
  if (existing) {
    process.stdout.write(`  reuse ${filename}\n`);
    return { _type: "reference", _ref: existing };
  }
  process.stdout.write(`  upload ${filename}… `);
  const asset = await client.assets.upload(kind, createReadStream(absolute), {
    filename,
  });
  process.stdout.write("ok\n");
  return { _type: "reference", _ref: asset._id };
}

function imageField(ref, key) {
  return {
    _type: "image",
    _key: key,
    asset: ref,
  };
}

function fileField(ref, key) {
  return {
    _type: "file",
    _key: key,
    asset: ref,
  };
}

async function seedCouple(couple, order) {
  console.log(`\n→ ${couple.title} (${couple.slug})`);

  const coverRef = await assetRef("image", couple.cover);
  const coverKeys = [];
  const covers = [];
  for (const [index, src] of (couple.covers ?? []).entries()) {
    const key = `cover-${index}`;
    coverKeys.push(key);
    covers.push(imageField(await assetRef("image", src), key));
  }

  const clips = [];
  for (const [index, src] of (couple.clips ?? []).entries()) {
    clips.push(fileField(await assetRef("file", src), `clip-${index}`));
  }

  const images = [];
  for (const [index, src] of (couple.images ?? []).entries()) {
    images.push(imageField(await assetRef("image", src), `img-${index}`));
  }

  const existingId = await client.fetch(
    `*[_type == "couple" && slug.current == $slug][0]._id`,
    { slug: couple.slug },
  );
  const id = existingId || `couple-${couple.slug}`;

  await client.createOrReplace({
    _id: id,
    _type: "couple",
    title: couple.title,
    slug: { _type: "slug", current: couple.slug },
    subtitle: "The Wedding of",
    venue: "Venue Name",
    city: CITIES[couple.slug] || "City",
    order,
    cover: { _type: "image", asset: coverRef },
    covers,
    clips: clips.length ? clips : undefined,
    images: images.length ? images : undefined,
  });

  console.log(`  saved ${id} (order ${order})`);
}

async function main() {
  console.log(`Seeding ${COUPLES.length} couples → ${projectId}/${dataset}`);
  // Confirm write access before uploading ~150MB.
  await client.fetch(`count(*[_type == "couple"])`);
  let order = 10;
  for (const couple of COUPLES) {
    await seedCouple(couple, order);
    order += 10;
  }
  const total = await client.fetch(`count(*[_type == "couple"])`);
  console.log(`\nDone. ${total} couple document(s) in Sanity.`);
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message || error);
  if (String(error.message || "").includes("Unauthorized")) {
    console.error(
      "Token cannot write to this project. Create an Editor token for rpgft93q and re-run with SANITY_API_TOKEN=…",
    );
  }
  process.exit(1);
});
