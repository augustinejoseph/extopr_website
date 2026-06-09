import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/config/env";

/**
 * ISR revalidation webhook, invoked by a Payload afterChange hook on publish.
 *
 * Why: SEO rules require ISR revalidation via a Payload publish webhook so published content goes
 * live without a redeploy. The request is guarded by a shared secret; a body specifies which path
 * to revalidate. This route lives outside the (payload) group so it is a plain Next.js handler.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const secret = request.headers.get("x-revalidate-secret");
  if (secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, error: "Unauthorized" }, { status: 401 });
  }

  let path: unknown;
  try {
    ({ path } = await request.json());
  } catch {
    return NextResponse.json({ revalidated: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof path !== "string" || !path.startsWith("/")) {
    return NextResponse.json(
      { revalidated: false, error: "Body must include a leading-slash `path`" },
      { status: 400 },
    );
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
