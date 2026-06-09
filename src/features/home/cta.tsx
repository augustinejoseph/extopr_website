import { CtaForm } from "./cta-form";

interface CtaProps {
  copy: { heading: string; accentWord?: string | null; body?: string | null };
  formLabels: {
    name: string;
    email: string;
    submit: string;
    note: string;
    errName: string;
    errEmail: string;
    success: string;
  };
}

/**
 * Closing CTA banner: paper box with soft cobalt glows, serif heading with an italic accent word,
 * and the email-capture form. Server Component (only the form is interactive). The `#start` anchor
 * is the target the header/hero CTAs scroll to.
 */
export function Cta({ copy, formLabels }: CtaProps) {
  return (
    <section id="start" className="py-16 md:py-16">
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface px-[clamp(26px,6vw,64px)] py-[clamp(36px,7vw,68px)] text-center shadow">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-[150px] -top-[200px] h-[460px] w-[460px] rounded-full"
            style={{ background: "radial-gradient(circle,rgba(44,75,255,.16),transparent 62%)" }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[230px] -left-[170px] h-[460px] w-[460px] rounded-full"
            style={{ background: "radial-gradient(circle,rgba(44,75,255,.10),transparent 62%)" }}
          />
          <h2 className="relative z-[1] text-display-cta text-foreground">
            {copy.heading}
            {copy.accentWord ? (
              <>
                {" "}
                <em className="font-serif italic text-primary">{copy.accentWord}</em>
              </>
            ) : null}
          </h2>
          {copy.body ? (
            <p className="relative z-[1] mx-auto mt-3.5 max-w-[44ch] text-base text-ink-2">
              {copy.body}
            </p>
          ) : null}
          <CtaForm labels={formLabels} />
        </div>
      </div>
    </section>
  );
}
