import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Headless WordPress",
    template: "%s | Headless WordPress",
  },
  description: "Next.js frontend powered by WordPress.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link className="site-logo" href="/">
              Headless Store
            </Link>
            <nav className="site-nav" aria-label="Main navigation">
              <Link href="/products">Products</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/cart">Cart</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
