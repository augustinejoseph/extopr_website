import { expect, test } from "@playwright/test";

/**
 * Homepage smoke tests. Verify the public site renders for the default locale with the SEO
 * essentials (single h1, canonical, hreflang, Organization JSON-LD) and that locale routing
 * resolves for a regional locale. These cover the behavior the SEO/i18n rules depend on.
 */
test("home page renders with a single h1 and the header/footer landmarks", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.locator("main#main")).toBeVisible();
});

test("home page exposes canonical and hreflang alternates", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  // hreflang alternates for every supported locale.
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="ta"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="kn"]')).toHaveCount(1);
});

test("home page emits Organization JSON-LD", async ({ page }) => {
  await page.goto("/");
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const hasOrganization = scripts.some((s) => s.includes('"@type":"Organization"'));
  expect(hasOrganization).toBe(true);
});

test("a regional locale route resolves and sets the lang attribute", async ({ page }) => {
  await page.goto("/ta");
  await expect(page.locator("html")).toHaveAttribute("lang", "ta");
});
