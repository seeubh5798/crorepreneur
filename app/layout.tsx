import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Cursor } from "@/components/ui/Cursor";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { site } from "@/content/site";
import { introInitScript } from "@/lib/intro";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// Both typefaces are self-hosted (SIL Open Font License, see app/fonts), so
// the build needs no network access and no request ever leaves for a font CDN.
const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const instrumentSerif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f1ed" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Applies a stored theme choice before first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Decides before first paint whether the opening sequence plays this visit. */}
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <div aria-hidden="true" className="grain" />
        <Cursor />
      </body>
    </html>
  );
}
