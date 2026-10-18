import type { Metadata } from "next";
import { BRAND, SITE_DESCRIPTION } from "@/lib/i18n";
import HeroVideoPreview from "@/components/HeroVideoPreview";

export const metadata: Metadata = {
  title: `${BRAND.en.credit} — Video Preview`,
  description: SITE_DESCRIPTION.en,
  robots: { index: false, follow: false },
};

export default function VideoPreviewPage() {
  return <HeroVideoPreview />;
}
