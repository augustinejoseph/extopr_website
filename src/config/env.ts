import { z } from "zod";

/**
 * Centralized, validated environment configuration.
 *
 * Why: rules.md requires configuration to be typed and validated at startup, and code_style.md
 * forbids reading `process.env` inline across the codebase. Every consumer imports `env` from
 * here, so a missing/invalid variable fails loudly once, at boot, with an actionable message.
 *
 * The LMS base URL is intentionally optional/empty for now: the outbound LMS client is a later
 * phase, and cross-system links are added once the LMS surface is ready.
 */
const envSchema = z.object({
  // Postgres connection for the website's own database (never the LMS database).
  DATABASE_URI: z.string().min(1, "DATABASE_URI is required"),
  // Secret used by Payload to sign/encrypt; never committed.
  PAYLOAD_SECRET: z.string().min(1, "PAYLOAD_SECRET is required"),
  // Public, canonical site origin used for SEO (canonical URLs, hreflang, sitemap, OG).
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  // Outbound LMS API base URL for Enroll/Login deep links. Empty until the LMS client lands.
  LMS_API_BASE_URL: z.string().default(""),
  // Shared secret guarding the Payload publish -> ISR revalidation webhook.
  REVALIDATE_SECRET: z.string().default("dev-revalidate-secret"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

/**
 * Parse once at module load. Throwing here surfaces misconfiguration at startup rather than
 * deep inside a request handler.
 */
function loadEnv(): z.infer<typeof envSchema> {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return parsed.data;
}

export const env = loadEnv();

export type Env = z.infer<typeof envSchema>;
