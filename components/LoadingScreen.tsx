"use client";

import { BRAND } from "@/lib/i18n";

export default function LoadingScreen({ progress, arabic }: {
  progress: number; arabic: boolean;
}) {
  const brand = arabic ? BRAND.ar : BRAND.en;
  return <div className="map-intro" role="status" aria-label={arabic ? "جارٍ تحميل الخريطة" : "Loading map"}>
    <div className="intro-brand" aria-hidden="true">
      <svg className="intro-mark" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 52 32 12l20 40H12Zm20-40v40M23 32l9 20 9-20M19 52l13-14 13 14" />
      </svg>
      <div className="intro-wordmark">{brand.name}<span>{brand.tag}</span></div>
    </div>
    <div className="intro-progress" aria-hidden="true">
      <div className="intro-track"><span style={{ width: `${progress}%` }} /></div>
      <span className="intro-percent" dir="ltr">{Math.round(progress)}%</span>
    </div>
    <span className="intro-copyright">{new Date().getFullYear()} {arabic ? "جميع الحقوق محفوظة" : "All rights reserved"}</span>
  </div>;
}
