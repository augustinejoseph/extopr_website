import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Unit test runner config. Tests target framework-agnostic utilities and pure helpers (i18n
 * fallback, SEO mapping, JSON-LD, URL building). The @/ and @cms aliases mirror tsconfig so test
 * imports match application code.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@cms": resolve(__dirname, "./cms"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
  },
});
