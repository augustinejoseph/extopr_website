import { NextRequest, NextResponse } from "next/server";

/**
 * Request middleware.
 *
 * The site is English-only with no locale prefixes, so the only request-time concern here is
 * applying CMS-managed redirects (the Redirects collection). Everything else passes through.
 *
 * Excludes admin, API, Next internals, and static assets (handled by the matcher below).
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // CMS-managed redirects: a moved URL 301s cleanly.
  const redirect = await resolveCmsRedirect(request, pathname);
  if (redirect) return redirect;

  return NextResponse.next();
}

/**
 * Looks up a CMS-managed redirect for the given path via the Payload REST API.
 *
 * Why: redirects are authored in the Redirects collection (SEO rules) but next.config cannot load
 * them, so we resolve them at request time. The REST call is cached by Next's fetch cache so it is
 * not hit on every request. Only active, non-soft-deleted rows match. Failures are non-fatal: a
 * lookup error simply means no redirect is applied.
 */
async function resolveCmsRedirect(
  request: NextRequest,
  pathname: string,
): Promise<NextResponse | null> {
  try {
    const query = new URLSearchParams({
      "where[from][equals]": pathname,
      "where[active][equals]": "true",
      "where[deletedAt][equals]": "null",
      limit: "1",
      depth: "0",
    });
    const apiUrl = new URL(`/api/redirects?${query.toString()}`, request.nextUrl.origin);
    const response = await fetch(apiUrl, { next: { revalidate: 60, tags: ["redirects"] } });
    if (!response.ok) return null;

    const data: { docs?: Array<{ to?: string; type?: string }> } = await response.json();
    const doc = data.docs?.[0];
    if (!doc?.to) return null;

    const destination = doc.to.startsWith("http")
      ? doc.to
      : new URL(doc.to, request.nextUrl.origin).toString();
    return NextResponse.redirect(destination, doc.type === "302" ? 302 : 301);
  } catch {
    return null;
  }
}

export const config = {
  // Skip Payload admin/api, Next internals, and files with an extension.
  matcher: ["/((?!admin|api|_next|.*\\..*).*)"],
};
