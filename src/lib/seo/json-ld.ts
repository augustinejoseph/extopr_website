/**
 * Typed JSON-LD structured-data builders.
 *
 * Why: SEO rules require valid JSON-LD (Organization, Course, BlogPosting) plus VideoObject for
 * the homepage video section. Builders return plain objects that a small <JsonLd> component
 * serializes into a script tag. Keeping them pure makes them unit-testable and reusable.
 */

interface OrganizationInput {
  name: string;
  url: string;
  logoUrl?: string;
}

export function organizationJsonLd({ name, url, logoUrl }: OrganizationInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logoUrl ? { logo: logoUrl } : {}),
  };
}

interface CourseInput {
  name: string;
  description?: string;
  url: string;
  providerName: string;
  providerUrl: string;
}

export function courseJsonLd({
  name,
  description,
  url,
  providerName,
  providerUrl,
}: CourseInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    ...(description ? { description } : {}),
    url,
    provider: {
      "@type": "Organization",
      name: providerName,
      sameAs: providerUrl,
    },
  };
}

interface BlogPostingInput {
  headline: string;
  description?: string;
  url: string;
  datePublished?: string;
  authorName?: string;
  imageUrl?: string;
}

export function blogPostingJsonLd({
  headline,
  description,
  url,
  datePublished,
  authorName,
  imageUrl,
}: BlogPostingInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    ...(description ? { description } : {}),
    mainEntityOfPage: url,
    ...(datePublished ? { datePublished } : {}),
    ...(authorName ? { author: { "@type": "Person", name: authorName } } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
  };
}

interface VideoObjectInput {
  name: string;
  youtubeId: string;
  thumbnailUrl?: string;
}

export function videoObjectJsonLd({
  name,
  youtubeId,
  thumbnailUrl,
}: VideoObjectInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    thumbnailUrl: thumbnailUrl ?? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}
