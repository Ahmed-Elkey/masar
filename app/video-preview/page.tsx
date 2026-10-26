import type { Metadata } from "next";
import { BRAND, SITE_DESCRIPTION } from "@/lib/i18n";
import HeroVideoPreview from "@/components/HeroVideoPreview";

const isArabic = (lang?: string) => lang === "ar";

export async function generateMetadata({ searchParams: searchParamsPromise }: { searchParams: Promise<{lang?:string}> }): Promise<Metadata>{const searchParams=await searchParamsPromise;
  const ar = isArabic(searchParams.lang);
  return {
    title: ar ? `${BRAND.ar.credit} — معاينة الفيديو` : `${BRAND.en.credit} — Video Preview`,
    description: ar ? SITE_DESCRIPTION.ar : SITE_DESCRIPTION.en,
    robots: { index: false, follow: false },
  };
}

export default async function VideoPreviewPage({ searchParams: searchParamsPromise }: { searchParams: Promise<{lang?:string}> }){const searchParams=await searchParamsPromise;
  return <HeroVideoPreview initialLang={isArabic(searchParams.lang) ? "ar" : "en"} />;
}
