/** English UI strings. The canonical set: every other locale's keys are a subset that falls back
 * here. Keep keys flat and descriptive. */
export const en = {
  "nav.skipToContent": "Skip to content",
  "nav.courses": "Courses",
  "nav.why": "Why extopr",
  "nav.toppers": "Toppers",
  "nav.studyDesk": "Study Desk",
  "nav.login": "Log in",
  "nav.register": "Register",

  "hero.headline": "From aspirant to topper.",
  "hero.subCopy":
    "One focused platform for NEET, JEE, CA & Commerce — live classes, India's sharpest faculty, and a study plan that actually moves your rank.",
  "hero.getStarted": "Get Started Free",
  "hero.exploreCourses": "Explore Courses",
  "hero.reviewsSuffix": "student reviews",
  "hero.previous": "Previous slide",
  "hero.next": "Next slide",
  "hero.goToSlide": "Go to slide",

  "examStrip.eyebrow": "Pick your exam",
  "examStrip.swipe": "Swipe to explore →",

  "why.eyebrow": "Why extopr",
  "why.heading": "Built for rank, not for noise.",

  "courses.eyebrow": "Featured courses",
  "courses.heading": "Programs designed to get you ranked.",
  "courses.enroll": "Enroll",

  "home.testimonials.eyebrow": "Topper stories",
  "home.testimonials.heading": "Ranks that started right here.",

  "home.latestPosts.eyebrow": "From the Study Desk",
  "home.latestPosts.heading": "extopr Reads",
  "home.latestPosts.lead":
    "Strategy, syllabus shortcuts and mindset notes — written by mentors who've cracked the exam you're sitting.",
  "home.latestPosts.viewAll": "View All Articles",
  "home.latestPosts.readMore": "Read More",

  // Videos section — not on the homepage in the redesign, kept for reuse on other pages.
  "home.videos.heading": "Watch and learn",
  "home.videos.play": "Play video",

  "cta.heading": "Your rank is waiting.",
  "cta.body":
    "Join free today. Get a personalised study plan, one live class on us, and your first mock test — no card required.",
  "cta.name": "Your name",
  "cta.email": "Email address",
  "cta.submit": "Join extopr",
  "cta.note": "Free forever for your first course. Cancel anytime.",
  "cta.errName": "Add your name so we can personalise your study plan.",
  "cta.errEmail": "Please enter a valid email so we can save your spot.",
  "cta.success": "🎉 You're in! Check your inbox to set your exam & build your plan.",

  "footer.tagline": "The premium study companion for India's next generation of toppers.",
  "footer.madeInIndia": "Made in India.",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.contact": "Contact",
  "social.instagram": "Instagram",
  "social.youtube": "YouTube",
  "social.x": "X",
  "social.telegram": "Telegram",
} as const;

export type MessageKey = keyof typeof en;
