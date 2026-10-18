import type { Metadata, Viewport } from "next";
import { BRAND, SITE_DESCRIPTION, siteTitle } from "@/lib/i18n";
import "./fonts.css";
import "./globals.css";

const TITLE = siteTitle("en");
const DESCRIPTION = SITE_DESCRIPTION.en;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: BRAND.en.credit,
  openGraph: {
    type: "website",
    siteName: BRAND.en.credit,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5, themeColor: "#171a1e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://server.arcgisonline.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://services.arcgisonline.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://a.tiles.openrailwaymap.org" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
