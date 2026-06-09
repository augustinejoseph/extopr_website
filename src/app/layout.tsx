/**
 * Root layout.
 *
 * Why: both the (payload) admin and the (site) public route groups render their own <html> with
 * the correct attributes (the admin sets its own; the site sets lang per locale). This root layout
 * is intentionally a pass-through so neither group inherits a conflicting <html>/<body>.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
