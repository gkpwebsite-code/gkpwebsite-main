import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity calls this every time something is published. It checks the request really came
 * from Sanity (signed with SANITY_REVALIDATE_SECRET), then marks every page as out of date,
 * so each one is rebuilt with the new content on its next visit — within seconds of Publish.
 *
 * Everything is refreshed, not just the edited page: contact details and couples appear on
 * many pages at once, and the site is small enough that a full refresh is cheap.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not set on the server" },
      { status: 500 },
    );
  }

  try {
    // Also waits briefly so Sanity's API already serves the just-published content.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      secret,
      true,
    );
    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Bad request" },
      { status: 400 },
    );
  }
}
