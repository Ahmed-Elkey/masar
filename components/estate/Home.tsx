"use client";
import {Chevron} from "./Brand";

import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";
import {useProjects} from "./CatalogueProvider";
import ProjectImage from "@/components/ProjectImage";
import { Blossom } from "./Brand";
import { c, siteHref } from "./SiteShell";
import EntryReveal from "./EntryReveal";
import RisingIntro from "./RisingIntro";
import LowerHome from "./LowerHome";

export default function Home({ lang }: { lang: Lang }) {
 const PROJECTS=useProjects();
  const [entryComplete, setEntryComplete] = useState(false);
  const finishEntry = useCallback(() => setEntryComplete(true), []);
  const [night, setNight] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [reason, setReason] = useState(0);
  const reasonRef = useRef<HTMLElement>(null);
  const reasonProgress = useRef<HTMLSpanElement>(null);
  const reasonClock = useRef(0);
  const [reasonPhase, setReasonPhase] = useState("idle");
  const reasonBusy = useRef(false);
  const reasonTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reasonIndex = useRef(0);
  const chooseReason = useCallback((index: number) => {
    if (reasonBusy.current || index === reasonIndex.current) return;
    reasonClock.current = 0;
    if (reasonProgress.current) reasonProgress.current.style.transform = "scaleX(0)";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { reasonIndex.current = index; setReason(index); return; }
    reasonBusy.current = true;
    setReasonPhase("out");
    reasonTimers.current.push(setTimeout(() => {
      reasonIndex.current = index;
      setReason(index);
      setReasonPhase("in");
      reasonTimers.current.push(setTimeout(() => { setReasonPhase("idle"); reasonBusy.current = false; }, 1150));
    }, 850));
  }, []);
  useEffect(() => () => reasonTimers.current.forEach(clearTimeout), []);
  const [reasonVisible, setReasonVisible] = useState(false);
  const [reasonPaused, setReasonPaused] = useState(false);
  useEffect(() => {
    const element = reasonRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setReasonVisible(entry.isIntersecting), { threshold: .35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { reasonClock.current = 0; if (reasonProgress.current) reasonProgress.current.style.transform = "scaleX(0)"; }, [reason]);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (!reasonVisible || reasonPaused || reduced.matches) return;
    let frame = 0, previous = 0;
    const tick = (now: number) => {
      if (previous && reasonVisible && !reasonPaused && !document.hidden && !reduced.matches && !reasonBusy.current) {
        reasonClock.current += Math.min(now - previous, 100);
        if (reasonProgress.current) reasonProgress.current.style.transform = `scaleX(${Math.min(1, reasonClock.current / 6000)})`;
        if (reasonClock.current >= 6000) { reasonClock.current = 0; chooseReason((reasonIndex.current + 1) % 3); }
      }
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reasonVisible, reasonPaused, chooseReason]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const filmManuallyPaused = useRef(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const syncVideo = () => { if (reduced.matches || !visible || filmManuallyPaused.current) videoRef.current?.pause(); else void videoRef.current?.play().catch(() => setPlaying(false)); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio > .01; syncVideo(); }, { threshold: [0, .01] });
    const hero = videoRef.current?.closest(".estate-hero");
    if (hero) observer.observe(hero);
    syncVideo(); reduced.addEventListener("change", syncVideo);
    return () => { observer.disconnect(); reduced.removeEventListener("change", syncVideo); };
  }, [lang]);
  const reasons = [
    { en: "A sense of place", ar: "المكان يصنع الفرق", body: "Discover the neighbourhood around your next address. Schools, green spaces, everyday essentials — see how life connects.", bodyAr: "اكتشف المنطقة المحيطة بعنوانك القادم. المدارس والمساحات الخضراء والخدمات اليومية، وشوف إزاي كل حاجة قريبة منك.", id: "mivida" },
    { en: "Life, considered", ar: "حياة على ذوقك", body: "From a home among gardens to a retreat beside the sea. Explore different places, and find the way of living that feels like you.", bodyAr: "من بيت وسط الحدائق لمكان هادئ على البحر. اكتشف وجهات مختلفة واختار أسلوب الحياة اللي يشبهك.", id: "fouka-bay" },
    { en: "A clearer view", ar: "صورة أوضح", body: "Bring the details together. Explore project photographs, read the brochures, and put every destination on the map.", bodyAr: "اجمع كل التفاصيل في مكان واحد. شوف صور المشاريع، اقرأ البروشورات، واستكشف موقع كل وجهة على الخريطة.", id: "il-bosco" },
  ];
  const current = reasons[reason];
  return <>
    {!entryComplete && <EntryReveal onComplete={finishEntry} />}
    <RisingIntro lang={lang}><section className={`estate-hero${night ? " by-night" : ""}`} data-entering={!entryComplete} aria-label={c(lang, "Welcome to Masar", "أهلًا بك في مَسَار")}>
      <div className="hero-scene"><video ref={videoRef} src="/videos/egypt-property-film.mp4" poster="/projects/mivida-0.webp" autoPlay muted loop playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><div className="hero-shade" /></div>
      <div className="hero-title" dir={lang === "ar" ? "rtl" : "ltr"}><span className="hero-location">{c(lang, "EGYPT", "مصر")}</span><h1 aria-label={c(lang, "Masar", "مَسَار")}>{(lang === "ar" ? ["مَسَار"] : ["MASAR"]).map((word, row) => <span className="hero-title-line" key={word} aria-hidden="true">{(lang === "ar" ? [word] : [...word]).map((letter, i) => <span className="hero-letter" key={i} style={{ "--letter-index": row * 4 + i } as CSSProperties}>{letter}</span>)}</span>)}</h1><span className="hero-script">{c(lang, "Egypt", "مصر")}</span></div><div className="hero-time" role="group" aria-label={c(lang, "Film appearance", "مظهر الفيديو")}><button aria-pressed={!night} onClick={() => setNight(false)}>{c(lang, "BY DAY", "نهارًا")}</button><i /><button aria-pressed={night} onClick={() => setNight(true)}>{c(lang, "BY NIGHT", "ليلًا")}</button></div>
      <div className="hero-motto"><span>{c(lang, "A PLACE", "مكان")}</span><span>{c(lang, "TO CALL HOME", "يشبهك")}</span></div>
      <Link className="hero-explore" href={siteHref("/projects", lang)}>{c(lang, "Discover your next address", "اكتشف عنوانك القادم")}<span>↓</span></Link>
      <div className="hero-bottom"><span>{c(lang, "EGYPT · PLACES FOR LIVING", "مصر · وجهات للحياة")}</span><button aria-label={c(lang, playing ? "Pause film" : "Play film", playing ? "إيقاف الفيديو" : "تشغيل الفيديو")} onClick={() => { const v = videoRef.current; filmManuallyPaused.current = !v?.paused; if (v?.paused) void v.play().catch(() => setPlaying(false)); else v?.pause(); }}>{playing ? "Ⅱ" : "▷"} <span>{c(lang, "THE FILM", "الفيلم")}</span></button><Link href={siteHref("/map", lang)}>{c(lang, "EXPLORE THE MAP", "استكشف الخريطة")} ↗</Link></div>
    </section></RisingIntro>

    <section ref={reasonRef} className="reasons-section" aria-label={c(lang, "Three ways to find your place", "ثلاث طرق لاكتشاف مكانك")}>
      <div className="reasons-arc" aria-hidden="true"><svg viewBox="0 0 1000 220"><defs><path id="reason-arc" d="M100 210 Q500 -100 900 210" /></defs><text><textPath href="#reason-arc" startOffset="50%" textAnchor="middle">{c(lang, "THREE WAYS TO FIND YOUR PLACE", "ثلاث طرق لاكتشاف مكانك")}</textPath></text></svg></div>
      <div className="reasons-top"><span>{c(lang, "EGYPT", "مصر")}</span><Blossom /><span>{c(lang, "MASAR", "مَسَار")}</span></div>

      <div className="reasons-body" data-phase={reasonPhase}>
        <h2 key={`title-${reason}`} className="display" aria-label={c(lang, current.en, current.ar)}>{c(lang, current.en, current.ar).split(" ").map((word, wi) => <span className="reason-word" key={wi} aria-hidden="true">{(lang === "ar" ? [word] : [...word]).map((letter, li) => <span className="reason-letter" key={li} style={{ "--char-delay": `${(wi * 4 + li) * 18}ms` } as CSSProperties}>{letter}</span>)}{ " " }</span>)}</h2>
        <div className="reason-photo">{reasons.map((r,i)=><div className="reason-slide-image" key={r.id} data-active={reason===i} aria-hidden={reason!==i}><ProjectImage project={PROJECTS.find(p=>p.id===r.id)!} lang={lang} eager sizes="(max-width:760px) 72vw, 28vw" /></div>)}</div>
        <div className="editorial-pagination"><button aria-label={c(lang, "Previous story", "القصة السابقة")} onClick={() => chooseReason((reason + 2) % 3)}><Chevron direction="left"/></button><span>{reason + 1}</span><div className="reason-progress-track"><span ref={reasonProgress} className="reason-progress-fill" aria-hidden="true" />{reasons.map((r, i) => <button key={r.id} className={i === reason ? "active" : ""} aria-label={c(lang, r.en, r.ar)} aria-pressed={i === reason} onClick={() => chooseReason(i)} />)}</div><span>3</span><button aria-label={c(lang, "Next story", "القصة التالية")} onClick={() => chooseReason((reason + 1) % 3)}><Chevron direction="right"/></button></div>
        <button className="reason-playback" aria-pressed={reasonPaused} onClick={() => setReasonPaused(value => !value)}>{c(lang, reasonPaused ? "RESUME STORIES ▷" : "PAUSE STORIES Ⅱ", reasonPaused ? "تشغيل العرض ▷" : "إيقاف العرض Ⅱ")}</button>
        <p key={`copy-${reason}`}>{c(lang, current.body, current.bodyAr)}</p>
        <span className="reason-caption">{c(lang, "A PLACE TO LIVE — TO RETURN YEAR AFTER YEAR", "مكان للحياة — تحب ترجع له كل سنة")}</span>
      </div>
    </section>
    <section className="blue-editorial" aria-label={c(lang, "A different perspective", "من منظور مختلف")}>
      <div className="blue-editorial-photo"><ProjectImage project={PROJECTS.find(p => p.id === "mivida")!} index={5} lang={lang} sizes="100vw" /></div>
      <div className="blue-editorial-copy" data-reveal><span className="blue-quote-mark" aria-hidden="true">“</span><h2 className="display">{c(lang, "A home begins with its surroundings. Gardens, walking paths and everyday connections bring a place to life.", "البيت بيبدأ من المكان اللي حواليه. الحدائق والممرات وتفاصيل كل يوم هي اللي بتدي المكان روحه.")}</h2><span className="eyebrow">{c(lang, "OUR PERSPECTIVE", "رؤيتنا")}<br />{c(lang, "MASAR", "مَسَار")}</span></div>
    </section>

    <LowerHome lang={lang} />
  </>;
}
