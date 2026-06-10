import { expect, test } from "@playwright/test";

/**
 * Homepage smoke tests. Verify the public site renders with the SEO essentials (single h1,
 * canonical, Organization JSON-LD) and the `lang` attribute. The site is English-only, so there
 * are no hreflang alternates or locale routes.
 */
test("home page renders with a single h1 and the header/footer landmarks", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.locator("main#main")).toBeVisible();
});

test("home page exposes a canonical URL and sets lang=en", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  // English-only: no hreflang alternates.
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
});

test("home page emits Organization JSON-LD", async ({ page }) => {
  await page.goto("/");
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const hasOrganization = scripts.some((s) => s.includes('"@type":"Organization"'));
  expect(hasOrganization).toBe(true);
});
