"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HeroVideoPreview.module.css";

export default function HeroVideoPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

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

  return (
    <main className={styles.preview}>
      <div className={styles.videoStage}>
        <video ref={videoRef} className={styles.active} src="/videos/egypt-property-film.mp4"
          poster="/projects/mivida-0.webp" muted playsInline loop preload="auto"
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={() => setFailed(true)} aria-label="فيلم عقاري من لقطات ميفيدا ووجهات أورا" />
        <div className={styles.shade} />
      </div>
      <header className={styles.brand}>
        <span className={styles.mark}>≈</span><span>NILE ESTATES<small>EGYPT INVESTMENT MAP</small></span>
      </header>
      <section className={styles.caption} dir="rtl">
        <span>أماكن تستحق أن تعيشها</span>
        <h1>اكتشف عنوانك القادم</h1>
        <a className={styles.explore} href="/?lang=ar">استكشف الخريطة <span aria-hidden="true">←</span></a>
      </section>
      <footer className={styles.footer}>
        <span>مصر · وجهات للحياة والاستثمار</span>
        <div className={styles.credits}>
          <span>معاينة · لقطات</span>
          <a href="https://www.emaarmisr.com/our-communities/mivida-new-cairo/" target="_blank" rel="noreferrer">إعمار مصر</a>
          <span>و</span>
          <a href="https://www.ora-egypt.com/" target="_blank" rel="noreferrer">أورا</a>
        </div>
      </footer>
      <button className={styles.playback} onClick={() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) void video.play().catch(() => setPlaying(false));
        else video.pause();
      }}>{playing ? "إيقاف مؤقت" : "تشغيل الفيديو"}</button>
      {failed && <p className={styles.error} role="alert">تعذر تشغيل الفيديو. أعد تحميل الصفحة للمحاولة مجددًا.</p>}
    </main>
  );
}
