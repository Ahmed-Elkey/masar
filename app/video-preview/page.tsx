import type { Metadata } from "next";
import { BRAND, SITE_DESCRIPTION } from "@/lib/i18n";
import HeroVideoPreview from "@/components/HeroVideoPreview";

const isArabic = (lang?: string) => lang === "ar";

export function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Metadata {
  const ar = isArabic(searchParams.lang);
  return {
    title: ar ? `${BRAND.ar.credit} — معاينة الفيديو` : `${BRAND.en.credit} — Video Preview`,
    description: ar ? SITE_DESCRIPTION.ar : SITE_DESCRIPTION.en,
    robots: { index: false, follow: false },
  };
}

export default function VideoPreviewPage({ searchParams }: { searchParams: { lang?: string } }) {
  return <HeroVideoPreview initialLang={isArabic(searchParams.lang) ? "ar" : "en"} />;
}
