/**
 * Serializes a JSON-LD object into a <script type="application/ld+json"> tag.
 *
 * Why: structured data must be emitted as a script in the document. This is a Server Component;
 * the data comes from the typed builders in lib/seo/json-ld. The <> escaping guards against any
 * stray closing tag in content breaking out of the script element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
