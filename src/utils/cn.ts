import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind utilities.
 *
 * Why: shared by every component that composes variant classes (shadcn/ui convention). Living in
 * utils/ keeps it framework-agnostic and reusable per code_style.md (DRY).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
