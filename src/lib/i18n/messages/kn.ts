import type { MessageKey } from "./en";

/** Kannada UI strings. Partial by design: any missing key falls back to English at load time. */
export const kn: Partial<Record<MessageKey, string>> = {
  "nav.skipToContent": "ವಿಷಯಕ್ಕೆ ಹೋಗಿ",
  "nav.courses": "ಕೋರ್ಸ್‌ಗಳು",
  "nav.why": "extopr ಏಕೆ",
  "nav.toppers": "ಟಾಪರ್‌ಗಳು",
  "nav.studyDesk": "ಅಧ್ಯಯನ ಮೇಜು",
  "nav.login": "ಲಾಗಿನ್",
  "nav.register": "ನೋಂದಣಿ",

  "hero.headline": "ಆಕಾಂಕ್ಷಿಯಿಂದ ಟಾಪರ್‌ವರೆಗೆ.",
  "hero.subCopy":
    "NEET, JEE, CA ಮತ್ತು ವಾಣಿಜ್ಯಕ್ಕಾಗಿ ಒಂದೇ ಕೇಂದ್ರೀಕೃತ ವೇದಿಕೆ — ನೇರ ತರಗತಿಗಳು, ಭಾರತದ ಅತ್ಯುತ್ತಮ ಬೋಧಕರು, ಮತ್ತು ನಿಮ್ಮ ಶ್ರೇಯಾಂಕವನ್ನು ನಿಜವಾಗಿಯೂ ಮುನ್ನಡೆಸುವ ಅಧ್ಯಯನ ಯೋಜನೆ.",
  "hero.getStarted": "ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ",
  "hero.exploreCourses": "ಕೋರ್ಸ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
  "hero.reviewsSuffix": "ವಿದ್ಯಾರ್ಥಿ ವಿಮರ್ಶೆಗಳು",
  "hero.previous": "ಹಿಂದಿನ ಚಿತ್ರ",
  "hero.next": "ಮುಂದಿನ ಚಿತ್ರ",
  "hero.goToSlide": "ಚಿತ್ರಕ್ಕೆ ಹೋಗಿ",

  "examStrip.eyebrow": "ನಿಮ್ಮ ಪರೀಕ್ಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  "examStrip.swipe": "ಅನ್ವೇಷಿಸಲು ಸ್ವೈಪ್ ಮಾಡಿ →",

  "why.eyebrow": "extopr ಏಕೆ",
  "why.heading": "ಗದ್ದಲಕ್ಕಲ್ಲ, ಶ್ರೇಯಾಂಕಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ.",

  "courses.eyebrow": "ವೈಶಿಷ್ಟ್ಯ ಕೋರ್ಸ್‌ಗಳು",
  "courses.heading": "ನಿಮ್ಮನ್ನು ಶ್ರೇಯಾಂಕಿತಗೊಳಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಿದ ಕಾರ್ಯಕ್ರಮಗಳು.",
  "courses.enroll": "ದಾಖಲಾಗಿ",

  "home.testimonials.eyebrow": "ಟಾಪರ್ ಕಥೆಗಳು",
  "home.testimonials.heading": "ಇಲ್ಲಿಯೇ ಆರಂಭವಾದ ಶ್ರೇಯಾಂಕಗಳು.",

  "home.latestPosts.eyebrow": "ಅಧ್ಯಯನ ಮೇಜಿನಿಂದ",
  "home.latestPosts.heading": "extopr ಓದುಗಳು",
  "home.latestPosts.lead":
    "ತಂತ್ರಗಳು, ಪಠ್ಯಕ್ರಮದ ಸುಲಭ ಮಾರ್ಗಗಳು ಮತ್ತು ಮನೋಭಾವ ಟಿಪ್ಪಣಿಗಳು — ನೀವು ಬರೆಯುತ್ತಿರುವ ಪರೀಕ್ಷೆಯನ್ನು ಗೆದ್ದ ಮಾರ್ಗದರ್ಶಕರಿಂದ ಬರೆಯಲಾಗಿದೆ.",
  "home.latestPosts.viewAll": "ಎಲ್ಲಾ ಲೇಖನಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
  "home.latestPosts.readMore": "ಮತ್ತಷ್ಟು ಓದಿ",

  "home.videos.heading": "ನೋಡಿ ಕಲಿಯಿರಿ",
  "home.videos.play": "ವೀಡಿಯೋ ಪ್ಲೇ ಮಾಡಿ",

  "cta.heading": "ನಿಮ್ಮ ಶ್ರೇಯಾಂಕ ಕಾಯುತ್ತಿದೆ.",
  "cta.body":
    "ಇಂದೇ ಉಚಿತವಾಗಿ ಸೇರಿ. ವೈಯಕ್ತೀಕರಿಸಿದ ಅಧ್ಯಯನ ಯೋಜನೆ, ನಮ್ಮ ಕಡೆಯಿಂದ ಒಂದು ನೇರ ತರಗತಿ, ಮತ್ತು ನಿಮ್ಮ ಮೊದಲ ಅಣಕು ಪರೀಕ್ಷೆ — ಕಾರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ.",
  "cta.name": "ನಿಮ್ಮ ಹೆಸರು",
  "cta.email": "ಇಮೇಲ್ ವಿಳಾಸ",
  "cta.submit": "extopr ಸೇರಿ",
  "cta.note": "ನಿಮ್ಮ ಮೊದಲ ಕೋರ್ಸ್‌ಗೆ ಶಾಶ್ವತವಾಗಿ ಉಚಿತ. ಯಾವಾಗ ಬೇಕಾದರೂ ರದ್ದುಗೊಳಿಸಿ.",
  "cta.errName": "ನಿಮ್ಮ ಅಧ್ಯಯನ ಯೋಜನೆಯನ್ನು ವೈಯಕ್ತೀಕರಿಸಲು ನಿಮ್ಮ ಹೆಸರನ್ನು ಸೇರಿಸಿ.",
  "cta.errEmail": "ನಿಮ್ಮ ಸ್ಥಾನವನ್ನು ಉಳಿಸಲು ಮಾನ್ಯ ಇಮೇಲ್ ಅನ್ನು ನಮೂದಿಸಿ.",
  "cta.success": "🎉 ನೀವು ಸೇರಿದ್ದೀರಿ! ನಿಮ್ಮ ಪರೀಕ್ಷೆಯನ್ನು ಹೊಂದಿಸಲು ಮತ್ತು ಯೋಜನೆಯನ್ನು ರೂಪಿಸಲು ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ.",

  "footer.tagline": "ಭಾರತದ ಮುಂದಿನ ಪೀಳಿಗೆಯ ಟಾಪರ್‌ಗಳಿಗಾಗಿ ಅತ್ಯುತ್ತಮ ಅಧ್ಯಯನ ಸಂಗಾತಿ.",
  "footer.madeInIndia": "ಭಾರತದಲ್ಲಿ ತಯಾರಿಸಲಾಗಿದೆ.",
  "footer.privacy": "ಗೌಪ್ಯತೆ",
  "footer.terms": "ನಿಯಮಗಳು",
  "footer.contact": "ಸಂಪರ್ಕ",
  "social.instagram": "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್",
  "social.youtube": "ಯೂಟ್ಯೂಬ್",
  "social.x": "ಎಕ್ಸ್",
  "social.telegram": "ಟೆಲಿಗ್ರಾಮ್",

  "localeSwitcher.label": "ಭಾಷೆ",
};
