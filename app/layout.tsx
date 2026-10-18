import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";

const DESCRIPTION =
  "Interactive satellite map of real-estate investment projects across Egypt — New Capital, Sheikh Zayed, 6th of October, New Cairo and the North Coast.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Egypt Investment Map | Nile Estates",
  description: DESCRIPTION,
  applicationName: "Nile Estates",
  openGraph: {
    type: "website",
    siteName: "Nile Estates",
    title: "Egypt Investment Map | Nile Estates",
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Egypt Investment Map — Nile Estates" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Egypt Investment Map | Nile Estates",
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
