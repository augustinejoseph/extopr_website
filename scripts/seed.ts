/**
 * Seeds the database with sample localized content for local development.
 *
 * Why: gives the homepage and admin real data to render and demonstrates the en/ta/kn fallback
 * (some regional translations are intentionally omitted so the en value shows). Idempotent-ish:
 * it skips seeding when an admin user already exists, so re-running does not duplicate content.
 *
 * Images are generated in-process with sharp (no network dependency) and uploaded through the
 * Payload Local API so Media docs carry real files with width/height.
 */
import { getPayload, type Payload } from "payload";
import sharp from "sharp";

import config from "../cms/payload.config";

const ADMIN_EMAIL = "admin@extopr.test";
const ADMIN_PASSWORD = "Admin12345!";

/** Generate a solid-color PNG with a label, returned as a buffer for upload. */
async function makeImage(width: number, height: number, color: string): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: color,
    },
  })
    .png()
    .toBuffer();
}

/** Upload a generated image as a Media doc and return its id. */
async function uploadImage(
  payload: Payload,
  filename: string,
  alt: string,
  width: number,
  height: number,
  color: string,
): Promise<number> {
  const data = await makeImage(width, height, color);
  const doc = await payload.create({
    collection: "media",
    // `name` is the admin-friendly title; reuse the alt text as a sensible default.
    data: { name: alt, alt },
    file: {
      name: filename,
      data,
      mimetype: "image/png",
      size: data.length,
    },
  });
  return doc.id as number;
}

/**
 * Site-wide singletons that are safe to (re)apply on every run: the SiteSettings global and the
 * grouped footer navigation. Globals are singletons so updating is naturally idempotent; the
 * footer menu is matched by `location` and updated in place rather than duplicated. This lets the
 * bulk content seed stay guarded (skip once seeded) while still backfilling settings — e.g. the
 * footer social links — onto an already-populated DB.
 */
async function seedSettings(payload: Payload): Promise<void> {
  // SiteSettings global: hero copy, trust strip, "Why" stats, CTA, and footer social links.
  // Without the social URLs the footer social icons stay hidden (they render only when set).
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "en",
    data: {
      hero: {
        badge: "Trusted by 10,000+ rankers",
        headline: "From learner to",
        accentWord: "topper.",
        subCopy:
          "The premium study companion for India's next generation of toppers — guided lessons, expert mentors, and a plan that adapts to you.",
      },
      trust: {
        rating: "4.9",
        reviewCount: "12,400+ student reviews",
      },
      whyStats: [
        {
          stat: "10,000+",
          title: "Rankers mentored",
          description: "Students who reached their target exam with our guided programs.",
        },
        {
          stat: "94%",
          title: "Completion rate",
          description: "Learners who finish the course they start, thanks to weekly check-ins.",
        },
        {
          stat: "4.9/5",
          title: "Mentor rating",
          description: "Average rating across thousands of mentor sessions.",
        },
      ],
      cta: {
        heading: "Your seat is",
        accentWord: "waiting.",
        body: "Join thousands of learners building exam-ready study plans with extopr.",
        note: "Free forever for your first course. Cancel anytime.",
      },
      social: {
        instagram: "https://instagram.com/extopr",
        youtube: "https://youtube.com/@extopr",
        x: "https://x.com/extopr",
        telegram: "https://t.me/extopr",
      },
    },
  });

  // Footer navigation grouped into the mock's three columns. Update the existing row in place if
  // one already exists so re-running does not create a duplicate menu.
  const footerItems = [
    { column: "Company", label: "About", href: "/about" },
    { column: "Company", label: "Careers", href: "/careers" },
    { column: "Company", label: "Faculty", href: "/faculty" },
    { column: "Company", label: "Contact", href: "/contact" },
    { column: "Learn", label: "Courses", href: "/courses" },
    { column: "Learn", label: "Free resources", href: "/free-resources" },
    { column: "Learn", label: "Blog", href: "/blog" },
    { column: "Learn", label: "Mock tests", href: "/mock-tests" },
    { column: "Support", label: "Help center", href: "/help" },
    { column: "Support", label: "Privacy", href: "/privacy" },
    { column: "Support", label: "Terms", href: "/terms" },
    { column: "Support", label: "Refunds", href: "/refunds" },
  ];
  const existingFooter = await payload.find({
    collection: "navigation",
    where: { location: { equals: "footer" } },
    limit: 1,
  });
  if (existingFooter.docs[0]) {
    await payload.update({
      collection: "navigation",
      id: existingFooter.docs[0].id,
      locale: "en",
      data: { items: footerItems },
    });
  } else {
    await payload.create({
      collection: "navigation",
      locale: "en",
      data: { location: "footer", order: 0, items: footerItems },
    });
  }
}

async function seed(): Promise<void> {
  const payload = await getPayload({ config });

  // Skip the bulk content seed if already seeded (an admin user exists), but still (re)apply the
  // idempotent settings/footer so new fields like social links land on an existing DB.
  const existing = await payload.count({ collection: "users" });
  if (existing.totalDocs > 0) {
    payload.logger.info("Users already exist; applying settings only.");
    await seedSettings(payload);
    payload.logger.info("Settings applied.");
    process.exit(0);
  }

  payload.logger.info("Seeding database...");

  // 1) Admin user.
  await payload.create({
    collection: "users",
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: "Site Admin" },
  });

  // 2) Media for hero slides, testimonials, posts. Hero slides get a wide desktop image (16:9) and
  //    a separate portrait crop (4:5) so small screens are not stretched.
  const heroImg1 = await uploadImage(payload, "hero-aisha.png", "Aisha celebrating her result", 1600, 900, "#2563eb");
  const heroImg2 = await uploadImage(payload, "hero-ravi.png", "Ravi after graduation", 1600, 900, "#0ea5e9");
  const heroImg3 = await uploadImage(payload, "hero-meena.png", "Meena receiving her certificate", 1600, 900, "#16a34a");
  const heroImg1Mobile = await uploadImage(payload, "hero-aisha-mobile.png", "Aisha celebrating her result", 800, 1000, "#2563eb");
  const heroImg2Mobile = await uploadImage(payload, "hero-ravi-mobile.png", "Ravi after graduation", 800, 1000, "#0ea5e9");
  const heroImg3Mobile = await uploadImage(payload, "hero-meena-mobile.png", "Meena receiving her certificate", 800, 1000, "#16a34a");
  const avatar1 = await uploadImage(payload, "avatar-aisha.png", "Aisha", 200, 200, "#475569");
  const avatar2 = await uploadImage(payload, "avatar-ravi.png", "Ravi", 200, 200, "#64748b");
  const postCover = await uploadImage(payload, "post-study-tips.png", "Study tips cover", 1200, 630, "#1d4ed8");

  // 3) Navigation (header + footer) with localized labels (ta/kn partial -> en fallback).
  await payload.create({
    collection: "navigation",
    locale: "en",
    data: {
      location: "header",
      order: 0,
      items: [
        { label: "Courses", href: "/courses" },
        { label: "Blog", href: "/blog" },
        { label: "Pricing", href: "/pricing" },
        { label: "Contact", href: "/contact" },
      ],
    },
  });
  // Footer navigation + SiteSettings global (incl. footer social links). Shared idempotent helper.
  await seedSettings(payload);

  // 4) Hero carousel slides (achievement/caption localized; ta provided for the first only).
  const hero1 = await payload.create({
    collection: "hero-carousel",
    locale: "en",
    data: {
      order: 0,
      image: heroImg1,
      mobileImage: heroImg1Mobile,
      studentName: "Aisha Rahman",
      achievement: "Cleared the state board with distinction",
      caption: "From struggling with algebra to topping her class.",
    },
  });
  // Add a Tamil translation for the first slide to demonstrate localization.
  await payload.update({
    collection: "hero-carousel",
    id: hero1.id,
    locale: "ta",
    data: { achievement: "மாநில வாரியத்தில் சிறப்புத் தேர்ச்சி" },
  });

  await payload.create({
    collection: "hero-carousel",
    locale: "en",
    data: {
      order: 1,
      image: heroImg2,
      mobileImage: heroImg2Mobile,
      studentName: "Ravi Kumar",
      achievement: "Secured a place in his dream college",
      caption: "Consistent practice and mentor support made the difference.",
    },
  });
  await payload.create({
    collection: "hero-carousel",
    locale: "en",
    data: {
      order: 2,
      image: heroImg3,
      mobileImage: heroImg3Mobile,
      studentName: "Meena Iyer",
      achievement: "Earned a full scholarship",
      caption: "Proof that the right guidance changes outcomes.",
    },
  });

  // 5) Testimonials (quote localized; one with a Kannada translation).
  const testimonial1 = await payload.create({
    collection: "testimonials",
    locale: "en",
    data: {
      order: 0,
      studentName: "Aisha Rahman",
      photo: avatar1,
      quote: "The lessons were clear and the mentors genuinely cared about my progress.",
      course: "Class 12 Mathematics",
    },
  });
  await payload.update({
    collection: "testimonials",
    id: testimonial1.id,
    locale: "kn",
    data: { quote: "ಪಾಠಗಳು ಸ್ಪಷ್ಟವಾಗಿದ್ದವು ಮತ್ತು ಮಾರ್ಗದರ್ಶಕರು ನನ್ನ ಪ್ರಗತಿಯ ಬಗ್ಗೆ ನಿಜವಾಗಿಯೂ ಕಾಳಜಿ ವಹಿಸಿದರು." },
  });

  await payload.create({
    collection: "testimonials",
    locale: "en",
    data: {
      order: 1,
      studentName: "Ravi Kumar",
      photo: avatar2,
      quote: "I finally understood concepts I had given up on. Highly recommended.",
      course: "Physics Foundation",
    },
  });

  // 6) Videos (lite-facade YouTube ids; title localized).
  await payload.create({
    collection: "videos",
    locale: "en",
    data: { order: 0, title: "How our mentorship works", youtubeId: "ysz5S6PUM-U" },
  });
  await payload.create({
    collection: "videos",
    locale: "en",
    data: { order: 1, title: "A day in the life of an extopr learner", youtubeId: "aqz-KE-bpKQ" },
  });

  // 7) Blog posts (one with full SEO + ta title).
  const post1 = await payload.create({
    collection: "posts",
    locale: "en",
    data: {
      order: 0,
      title: "Five study habits that actually work",
      slug: "five-study-habits-that-work",
      excerpt: "Evidence-based routines you can start using this week.",
      coverImage: postCover,
      publishedAt: new Date("2026-05-01").toISOString(),
      seo: {
        title: "Five study habits that actually work | extopr",
        description: "Practical, evidence-based study habits for students preparing for exams.",
      },
    },
  });
  await payload.update({
    collection: "posts",
    id: post1.id,
    locale: "ta",
    data: { title: "உண்மையில் பயனளிக்கும் ஐந்து படிப்புப் பழக்கங்கள்" },
  });

  await payload.create({
    collection: "posts",
    locale: "en",
    data: {
      order: 1,
      title: "Choosing the right course for your goals",
      slug: "choosing-the-right-course",
      excerpt: "A short guide to matching courses to where you want to go.",
      publishedAt: new Date("2026-04-15").toISOString(),
    },
  });

  // 8) A course landing teaser (marketing copy only; deep links into the LMS when configured).
  await payload.create({
    collection: "course-landing",
    locale: "en",
    data: {
      order: 0,
      title: "Class 12 Mathematics",
      slug: "class-12-mathematics",
      teaser: "Master the full syllabus with guided lessons and weekly mentor check-ins.",
      lmsUrl: "",
      seo: {
        title: "Class 12 Mathematics course | extopr",
        description: "A complete, mentor-supported Class 12 Mathematics program.",
      },
    },
  });

  // 9) A couple of marketing pages.
  await payload.create({
    collection: "pages",
    locale: "en",
    data: {
      order: 0,
      title: "About extopr",
      slug: "about",
      seo: {
        title: "About extopr",
        description: "Learn how extopr helps students achieve their academic goals.",
      },
    },
  });

  payload.logger.info("Seed complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
