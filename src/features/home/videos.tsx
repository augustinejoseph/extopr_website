import { JsonLd } from "@/components/seo/json-ld";
import { getVideos } from "@/lib/cms/queries";
import { type Locale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n/messages";
import { videoObjectJsonLd } from "@/lib/seo/json-ld";
import { resolveImage } from "@/utils/media";

import { VideoFacade } from "./video-facade";

/**
 * YouTube videos section. Server Component that fetches ordered videos, emits VideoObject JSON-LD
 * per video for SEO, and renders the lite facade (iframe loads on click). Renders nothing if empty.
 */
export async function Videos({ locale }: { locale: Locale }) {
  const [videos, t] = [await getVideos(locale), getTranslator(locale)];
  if (videos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-8 text-2xl font-semibold text-foreground">{t("home.videos.heading")}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const customThumb = resolveImage(video.thumbnail, video.title);
          const thumbnailUrl =
            customThumb?.url ?? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
          return (
            <li key={video.id}>
              <JsonLd
                data={videoObjectJsonLd({
                  name: video.title,
                  youtubeId: video.youtubeId,
                  thumbnailUrl: customThumb?.url,
                })}
              />
              <VideoFacade
                youtubeId={video.youtubeId}
                title={video.title}
                thumbnailUrl={thumbnailUrl}
                playLabel={t("home.videos.play")}
              />
              <p className="mt-2 text-sm font-medium text-foreground">{video.title}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
