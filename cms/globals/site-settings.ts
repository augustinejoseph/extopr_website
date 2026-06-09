import type { GlobalConfig } from "payload";

/**
 * Site-wide singletons that the design mock hard-codes: hero badge/headline/sub-copy, trust
 * stats, the "Why" stat cards, CTA copy, and social links. A Payload global (not a collection)
 * fits one-of-a-kind content. Localized text uses English fallback like everything else.
 *
 * MARKETING COPY ONLY — counts and stats here are display strings, not authoritative LMS data.
 * Public read so the site renders it; writes stay admin-authenticated.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        {
          name: "badge",
          type: "text",
          localized: true,
          admin: { description: "Pill above the headline, e.g. 'Trusted by 10,000+ rankers'." },
        },
        {
          name: "headline",
          type: "text",
          localized: true,
          admin: { description: "Main headline. Wrap the accent word in the 'accentWord' field." },
        },
        {
          name: "accentWord",
          type: "text",
          localized: true,
          admin: { description: "Italic cobalt word appended to the headline, e.g. 'topper.'." },
        },
        {
          name: "subCopy",
          type: "textarea",
          localized: true,
        },
      ],
    },
    {
      name: "trust",
      type: "group",
      label: "Trust strip",
      fields: [
        { name: "rating", type: "text", admin: { description: "e.g. '4.9'." } },
        {
          name: "reviewCount",
          type: "text",
          localized: true,
          admin: { description: "e.g. '12,400+ student reviews'." },
        },
      ],
    },
    {
      name: "whyStats",
      type: "array",
      label: "Why stats",
      labels: { singular: "Stat", plural: "Stats" },
      admin: { description: "The stat feature cards in the 'Why' section." },
      fields: [
        { name: "stat", type: "text", localized: true, admin: { description: "e.g. '10,000+'." } },
        { name: "title", type: "text", localized: true, required: true },
        { name: "description", type: "textarea", localized: true },
      ],
    },
    {
      name: "cta",
      type: "group",
      label: "CTA banner",
      fields: [
        { name: "heading", type: "text", localized: true },
        {
          name: "accentWord",
          type: "text",
          localized: true,
          admin: { description: "Italic cobalt word in the CTA heading, e.g. 'waiting.'." },
        },
        { name: "body", type: "textarea", localized: true },
        {
          name: "note",
          type: "text",
          localized: true,
          admin: { description: "Fine print under the form." },
        },
      ],
    },
    {
      name: "social",
      type: "group",
      label: "Social links",
      admin: { description: "Footer social URLs. Leave empty to hide an icon." },
      fields: [
        { name: "instagram", type: "text" },
        { name: "youtube", type: "text" },
        { name: "x", type: "text", label: "X (Twitter)" },
        { name: "telegram", type: "text" },
      ],
    },
  ],
};
