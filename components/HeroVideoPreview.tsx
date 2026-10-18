"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import styles from "./HeroVideoPreview.module.css";

const COPY: Record<Lang, {
  kicker: string; title: string; explore: string; arrow: string; footer: string; credit: string;
  play: string; pause: string; otherLanguage: string; film: string; error: string;
}> = {
  en: {
    kicker: "Places worth living",
    title: "Find your next address",
    explore: "Explore the map",
    arrow: "→",
    footer: "Egypt · destinations for life and investment",
    credit: "Ora Developments — Mivida",
    play: "Play video",
    pause: "Pause video",
    otherLanguage: "العربية",
    film: "Real-estate film assembled from Mivida footage",
    error: "The video could not start. Reload the page to try again.",
  },
  ar: {
    kicker: "أماكن تستحق أن تعيشها",
    title: "اكتشف عنوانك القادم",
    explore: "استكشف الخريطة",
    arrow: "←",
    footer: "مصر · وجهات للحياة والاستثمار",
    credit: "أورا للتطوير — ميفيدا",
    play: "تشغيل الفيديو",
    pause: "إيقاف الفيديو",
    otherLanguage: "English",
    film: "فيلم عقاري من لقطات ميفيدا",
    error: "تعذر تشغيل الفيديو. أعد تحميل الصفحة للمحاولة مجددًا.",
  },
};

export default function HeroVideoPreview({ initialLang = "en" }: { initialLang?: Lang }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lang, setLang] = useState<Lang>(initialLang);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const copy = COPY[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = lang === "ar" ? `${BRAND.ar.credit} — معاينة الفيديو` : `${BRAND.en.credit} — Video Preview`;
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url.toString());
  }, [lang]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const video = videoRef.current;
      if (!video) return;
      if (motion.matches) video.pause();
      else void video.play().catch(() => setPlaying(false));
    };
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  return (
    <main className={styles.preview} lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className={styles.videoStage}>
        <video ref={videoRef} className={styles.active} src="/videos/egypt-property-film.mp4"
          poster="/projects/mivida-0.webp" muted playsInline loop preload="metadata"
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={() => setFailed(true)} aria-label={copy.film} />
        <div className={styles.shade} />
      </div>
      <header className={styles.brand}>
        <span className={styles.identity}>
          <span className={styles.mark}>≈</span>
          <span className={lang === "ar" ? `${styles.wordmark} ${styles.arabic}` : styles.wordmark}>
            {BRAND[lang].name}<small>{lang === "ar" ? BRAND.ar.map : BRAND.en.map.toUpperCase()}</small>
          </span>
        </span>
        <span className={styles.controls}>
          <button className={styles.control} onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{copy.otherLanguage}</button>
          <button className={styles.control} aria-pressed={playing} onClick={togglePlayback}>
            {playing ? copy.pause : copy.play}
          </button>
        </span>
      </header>
      <section className={styles.caption}>
        <span>{copy.kicker}</span>
        <h1>{copy.title}</h1>
        <a className={styles.explore} href={`/?lang=${lang}`}>{copy.explore} <span aria-hidden="true">{copy.arrow}</span></a>
      </section>
      <footer className={styles.footer}>
        <span>{copy.footer}</span>
        <span className={styles.credits}>
          <span>{lang === "ar" ? "معاينة · لقطات" : "Preview · footage"}</span>
          <a href="https://www.emaarmisr.com/our-communities/mivida-new-cairo/" target="_blank" rel="noreferrer">{copy.credit}</a>
        </span>
      </footer>
      {failed && <p className={styles.error} role="alert">{copy.error}</p>}
    </main>
  );
}
