# Gautam Khullar Photography

Next.js site for Gautam Khullar Photography. Portfolio couples, covers, clips and gallery photos are managed in **Sanity**.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sanity CMS

Couples live in Sanity. Until a project id is set, the site falls back to the local galleries in `src/lib/constants.ts`.

### 1. Create a Sanity project

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and create a project (or use an existing one).
2. Copy the **Project ID**.
3. Put it in `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production
```

4. Restart `npm run dev`.

### 2. Open the Studio

[http://localhost:3000/studio](http://localhost:3000/studio)

Log in with your Sanity account. Add the localhost origin under **API → CORS origins** if the Studio asks for it (`http://localhost:3000`).

### 3. Add a couple

For each wedding create a **Couple** document:

| Field                 | What to put                                 |
| --------------------- | ------------------------------------------- |
| Couple names          | e.g. `Sharon & Ishan`                       |
| Slug                  | auto from the name                          |
| City / place          | for “Where we’ve been”                      |
| Order                 | lower = earlier in the grid                 |
| Main cover            | one strong still (OG + index)               |
| Portfolio tile covers | **3–4** best stills (shuffle on each visit) |
| Film clips            | optional short MP4s (only some couples)     |
| Gallery photographs   | full story, ~25–30 images                   |

Publish the document. The homepage grid picks it up on the next load.

Videos are optional. Couples with only stills work fine; clips are mixed into the same cover rotation when present.
