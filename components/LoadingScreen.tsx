"use client";

import { BRAND } from "@/lib/i18n";
import { Blossom } from "./estate/Brand";

export default function LoadingScreen({ progress, arabic }: {
  progress: number; arabic: boolean;
}) {
  const brand = arabic ? BRAND.ar : BRAND.en;
  return <div className="map-intro" role="status" aria-label={arabic ? "جارٍ تحميل الخريطة" : "Loading map"}>
    <div className="intro-brand" aria-hidden="true">
      <Blossom className="intro-mark" />
      <div className="intro-wordmark">{brand.name}<span>{brand.tag}</span></div>
    </div>
    <div className="intro-progress" aria-hidden="true">
      <div className="intro-track"><span style={{ width: `${progress}%` }} /></div>
      <span className="intro-percent" dir="ltr">{Math.round(progress)}%</span>
    </div>
    <span className="intro-copyright">{new Date().getFullYear()} {arabic ? "جميع الحقوق محفوظة" : "All rights reserved"}</span>
  </div>;
}
