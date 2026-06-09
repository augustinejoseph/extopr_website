"use client";

import { useState } from "react";

import { ButtonArrow,buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface CtaFormLabels {
  name: string;
  email: string;
  submit: string;
  note: string;
  errName: string;
  errEmail: string;
  success: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email-capture form for the CTA banner. Client Component for validation + the success state.
 * Errors are announced as text (never color alone) and linked to their input via aria-describedby
 * (accessibility rules). Submission is a local stub for now — there is no signup endpoint yet.
 */
export function CtaForm({ labels }: { labels: CtaFormLabels }) {
  const [error, setError] = useState<"name" | "email" | null>(null);
  const [message, setMessage] = useState(labels.note);
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("cta-name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("cta-email") as HTMLInputElement).value.trim();

    if (!name) {
      setError("name");
      setDone(false);
      setMessage(labels.errName);
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("email");
      setDone(false);
      setMessage(labels.errEmail);
      return;
    }
    setError(null);
    setDone(true);
    setMessage(labels.success);
    form.reset();
  };

  const inputBase =
    "min-w-[160px] flex-1 rounded-pill border-[1.5px] bg-background px-[22px] py-[15px] text-[15px] font-medium text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:outline-none";

  return (
    <form noValidate onSubmit={onSubmit} className="relative z-[1] mx-auto mt-[30px] max-w-[520px]">
      <div className="flex flex-wrap gap-2.5">
        <label htmlFor="cta-name" className="sr-only">
          {labels.name}
        </label>
        <input
          id="cta-name"
          name="cta-name"
          type="text"
          autoComplete="name"
          placeholder={labels.name}
          aria-invalid={error === "name"}
          aria-describedby="cta-note"
          className={cn(inputBase, error === "name" ? "border-destructive" : "border-line-2")}
        />
        <label htmlFor="cta-email" className="sr-only">
          {labels.email}
        </label>
        <input
          id="cta-email"
          name="cta-email"
          type="email"
          autoComplete="email"
          placeholder={labels.email}
          aria-invalid={error === "email"}
          aria-describedby="cta-note"
          className={cn(inputBase, error === "email" ? "border-destructive" : "border-line-2")}
        />
      </div>
      <button type="submit" className={cn(buttonVariants({ variant: "primary" }), "group mt-2.5 w-full")}>
        {labels.submit}
        <ButtonArrow />
      </button>
      <p
        id="cta-note"
        role="status"
        aria-live="polite"
        className={cn(
          "mt-4 min-h-[18px] text-[13px]",
          done ? "text-success" : error ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {message}
      </p>
    </form>
  );
}
