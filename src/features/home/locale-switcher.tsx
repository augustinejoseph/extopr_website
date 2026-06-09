"use client";

import { usePathname, useRouter } from "next/navigation";

import { defaultLocale, type Locale,localeLabels, locales } from "@/lib/i18n/config";

/**
 * Locale switcher. Why: users pick a language and the UI must navigate to the same path under the
 * chosen locale (en is unprefixed; others are /{locale}-prefixed). Reads the supported set from
 * the i18n config — never a hard-coded list. Client Component because it navigates on change.
 */
export function LocaleSwitcher({ current, label }: { current: Locale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();

  // Strip any existing locale prefix to get the locale-agnostic path.
  const basePath = stripLocalePrefix(pathname);

  const onChange = (next: Locale) => {
    const target = next === defaultLocale ? basePath || "/" : `/${next}${basePath}`;
    router.push(target);
  };

  return (
    <label className="ml-1 inline-flex items-center text-sm">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={current}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="min-w-[7rem] cursor-pointer rounded-pill border-[1.5px] border-line-2 bg-surface py-2 pl-4 pr-3 text-[14.5px] font-semibold text-ink-2 transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabels[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Remove a leading /{locale} segment if present so we can re-prefix with the chosen locale. */
function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/");
  if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
}
