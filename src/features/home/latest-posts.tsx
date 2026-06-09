import Image from "next/image";
import Link from "next/link";

import { ButtonArrow,buttonVariants } from "@/components/ui/button";
import { getLatestPosts } from "@/lib/cms/queries";
import { type Locale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n/messages";
import { cn } from "@/utils/cn";
import { resolveImage } from "@/utils/media";
import { localePath } from "@/utils/urls";

import { Eyebrow } from "./section-head";

import type { ExamCategory, Faculty } from "@cms/payload-types";

/** Cover-image gradient fallbacks cycled when a post has no cover. */
const GRADIENTS = [
  "linear-gradient(135deg,#1F8A5B,#34B37D)",
  "linear-gradient(135deg,#2C4BFF,#5B73FF)",
  "linear-gradient(135deg,#E8743B,#F09A6E)",
];

function asDoc<T extends { id: number }>(rel: T | number | null | undefined): T | null {
  return rel && typeof rel === "object" ? rel : null;
}

/**
 * "Study Desk" blog strip — the 3 newest posts as design post-cards (category pill, cover or
 * gradient fallback, faculty byline, read time). Server Component; renders nothing when empty.
 */
export async function LatestPosts({ locale }: { locale: Locale }) {
  const [posts, t] = [await getLatestPosts(locale, 3), getTranslator(locale)];
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="bg-ivory-2 py-24 md:py-32">
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow>{t("home.latestPosts.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-display-section text-foreground">
              {t("home.latestPosts.heading")}
            </h2>
          </div>
          <p className="max-w-[32ch] text-base text-ink-2">{t("home.latestPosts.lead")}</p>
        </div>

        <ul className="grid gap-[22px] md:grid-cols-3">
          {posts.map((post, i) => {
            const cover = resolveImage(post.coverImage, post.title);
            const author = asDoc<Faculty>(post.author);
            const category = asDoc<ExamCategory>(post.category);
            return (
              <li
                key={post.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:shadow"
              >
                <Link
                  href={localePath(`/blog/${post.slug}`, locale)}
                  className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  <div className="relative grid h-[158px] place-items-center overflow-hidden">
                    {cover ? (
                      <Image
                        src={cover.url}
                        alt={cover.alt}
                        width={cover.width}
                        height={cover.height}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 grid place-items-center font-serif text-[46px] text-primary-foreground/90"
                        style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                      >
                        {post.title.trim()[0]?.toUpperCase()}
                      </div>
                    )}
                    {category ? (
                      <span className="absolute left-3.5 top-3.5 rounded-sm bg-foreground/55 px-[11px] py-1.5 text-[11px] font-extrabold uppercase tracking-[0.03em] text-background backdrop-blur-[6px]">
                        {category.name}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-[22px]">
                    <h3 className="text-[19px] font-extrabold leading-[1.25] tracking-[-0.02em] text-foreground">
                      {post.title}
                    </h3>
                    {post.excerpt ? (
                      <p className="mt-2.5 line-clamp-2 text-sm text-ink-2">{post.excerpt}</p>
                    ) : null}

                    <div className="mt-auto flex items-center gap-2.5 border-t border-border pt-4">
                      {author ? (
                        <>
                          <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {author.name.trim()[0]?.toUpperCase()}
                          </span>
                          <div>
                            <div className="text-[12.5px] font-bold leading-tight text-foreground">
                              {author.name}
                            </div>
                            {post.readTime ? (
                              <div className="text-[11.5px] text-muted-foreground">
                                {post.readTime}
                              </div>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                      <span className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-extrabold text-primary transition-[gap] group-hover:gap-2.5">
                        {t("home.latestPosts.readMore")} <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link
            href={localePath("/blog", locale)}
            className={cn(buttonVariants({ variant: "ghost" }), "group")}
          >
            {t("home.latestPosts.viewAll")}
            <ButtonArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
