import type { Field } from "payload";

/**
 * Reusable SEO field group, applied only to public/indexable collections (Pages, Posts,
 * CourseLanding). Why: SEO is the reason this repo exists; centralizing the group keeps metadata
 * consistent and feeds the buildMetadata helper.
 */
export function seoField(): Field {
  return {
    name: "seo",
    type: "group",
    label: "SEO",
    fields: [
      {
        name: "title",
        type: "text",
        admin: { description: "<title> for this page. Falls back to the page title if empty." },
      },
      {
        name: "description",
        type: "textarea",
        admin: { description: "Meta description." },
      },
      {
        name: "canonicalUrl",
        type: "text",
        admin: { description: "Optional canonical override. Defaults to the page's own URL." },
      },
      {
        name: "ogImage",
        type: "upload",
        relationTo: "media",
        admin: { description: "Open Graph / Twitter card image." },
      },
      {
        name: "noindex",
        type: "checkbox",
        defaultValue: false,
        admin: { description: "Exclude this page from search engines and the sitemap." },
      },
    ],
  };
}
