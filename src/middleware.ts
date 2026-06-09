import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

/**
 * Locale routing middleware.
 *
 * Why: routes live under /[locale]/... and the locale set must come from the single i18n config.
 * For non-default locales we require the prefix (e.g. /ta/...). The default locale (en) is served
 * unprefixed: requests without a known locale prefix are internally rewritten to the en segment so
 * the canonical public URL stays clean while the App Router still receives a [locale] param.
 *
 * Excludes admin, API, Next internals, and static assets (handled by the matcher below).
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // CMS-managed redirects take precedence over locale handling so a moved URL 301s cleanly.
  const redirect = await resolveCmsRedirect(request, pathname);
  if (redirect) return redirect;

  const firstSegment = pathname.split("/")[1];

  // A non-default locale prefix is already correct; let it through.
  if (isLocale(firstSegment) && firstSegment !== defaultLocale) {
    return NextResponse.next();
  }

  // Someone hit the default locale explicitly (/en/...): redirect to the clean unprefixed URL.
  if (firstSegment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    return NextResponse.redirect(url);
  }

  // No locale prefix: rewrite to the default-locale segment without changing the visible URL.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
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

// Re-exported so tests/build can assert the supported set without re-deriving it.
export { locales };
