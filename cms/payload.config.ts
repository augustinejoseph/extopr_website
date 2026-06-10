import path from "node:path";
import { fileURLToPath } from "node:url";
import { CourseLanding } from "@cms/collections/course-landing";
import { ExamCategories } from "@cms/collections/exam-categories";
import { Faculty } from "@cms/collections/faculty";
import { HeroCarousel } from "@cms/collections/hero-carousel";
import { Media } from "@cms/collections/media";
import { Navigation } from "@cms/collections/navigation";
import { Pages } from "@cms/collections/pages";
import { Posts } from "@cms/collections/posts";
import { Redirects } from "@cms/collections/redirects";
import { Testimonials } from "@cms/collections/testimonials";
import { Users } from "@cms/collections/users";
import { Videos } from "@cms/collections/videos";
import { SiteSettings } from "@cms/globals/site-settings";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { env } from "@/config/env";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload CMS configuration.
 *
 * - The site is English-only; no Payload localization (single table per collection).
 * - Postgres adapter points at the website's own database (never the LMS database).
 * - Collections are composed from the shared base (order/active/soft-delete) via buildCollection.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    Pages,
    Posts,
    Navigation,
    Redirects,
    CourseLanding,
    ExamCategories,
    Faculty,
    HeroCarousel,
    Testimonials,
    Videos,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  db: postgresAdapter({
    pool: { connectionString: env.DATABASE_URI },
  }),
  // Sharp powers upload image resizing (imageSizes in the Media collection).
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
