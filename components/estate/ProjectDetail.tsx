"use client";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import type { Lang, Project } from "@/lib/types";
import { PROJECTS } from "@/lib/data";
import { STRINGS } from "@/lib/i18n";
import ProjectImage, { projectMedia } from "@/components/ProjectImage";
import SatelliteThumb from "@/components/SatelliteThumb";
import { Arrow, Blossom } from "./Brand";
import { c, EditorialLink, siteHref } from "./SiteShell";

export default function ProjectDetail({ project: p, lang }: { project: Project; lang: Lang }) {
  const media = projectMedia(p), images = media.images;
  const [photo, setPhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const gallery = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const focus = useRef<HTMLElement | null>(null);
  const next = PROJECTS[(PROJECTS.findIndex(v => v.id === p.id) + 1) % PROJECTS.length];
  const mapHref = siteHref(`/map?project=${p.id}`, lang);
  const guide = media.brochureKind === "site-guide";
  const move = (delta: number) => { const index = (photo + delta + images.length) % images.length; setPhoto(index); if (!lightbox) gallery.current?.children[index]?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest", inline: "center" }); };
  useEffect(() => {
    if (!lightbox) return;
    focus.current = document.activeElement as HTMLElement;
    const site = document.querySelector<HTMLElement>(".estate-site"); if (site) site.inert = true;

    const main = document.querySelector<HTMLElement>(".estate-main");
    const others = [...Array.from(document.querySelectorAll<HTMLElement>(".estate-header,.estate-footer"))];
    others.forEach(el => el.inert = true);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setPhoto(v => (v + 1) % images.length);
      if (e.key === "ArrowLeft") setPhoto(v => (v - 1 + images.length) % images.length);
      if (e.key === "Tab") {
        const controls = Array.from(dialog.current?.querySelectorAll<HTMLButtonElement>("button") ?? []), first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; others.forEach(el => el.inert = false); if (main) main.inert = false; if (site) site.inert = false; window.removeEventListener("keydown", onKey); focus.current?.focus(); };
  }, [lightbox, images.length]);
  return <>
    <section className="project-hero"><ProjectImage project={p} lang={lang} eager sizes="100vw" /><div className="project-hero-heading"><span className="eyebrow">{p.developer} · {c(lang,"EGYPT","مصر")}</span><h1 className="display">{p.name[lang]}</h1><em>{p.area[lang]}</em></div><div className="project-hero-bottom"><span>{STRINGS[lang].status[p.status]}</span><EditorialLink href={mapHref}>{c(lang, "Discover the location", "اكتشف الموقع")}</EditorialLink></div></section>
    <section className="project-overview paper-section"><span className="eyebrow">{c(lang, "THE PROJECT", "المشروع")}</span><h2 className="statement" data-reveal>{p.description[lang]}</h2><dl className="project-facts"><div><dt>{c(lang, "THE DEVELOPER", "المطوّر")}</dt><dd>{p.developer}</dd></div><div><dt>{c(lang, "THE DESTINATION", "المنطقة")}</dt><dd>{p.area[lang]}</dd></div><div><dt>{c(lang, "PROJECT STATUS", "حالة المشروع")}</dt><dd>{STRINGS[lang].status[p.status]}</dd></div></dl><div className="project-overview-bottom"><p>{c(lang, "Discover the project through its imagery, surroundings, and available documents. Confirm current availability and specifications with the developer.", "اتعرف على المشروع من الصور والموقع والمستندات المتاحة. راجع المطوّر للتأكد من التوفر والمواصفات الحالية.")}</p><EditorialLink href="#photographs">{c(lang, "A closer look", "نظرة أقرب")}</EditorialLink></div></section>
    <section className="project-gallery" id="photographs"><div className="project-gallery-title"><h2 className="display">{c(lang, "A closer look", "نظرة أقرب")}</h2><div className="gallery-pager"><button onClick={() => move(-1)} aria-label={c(lang, "Previous image", "الصورة السابقة")}>←</button><span>{String(photo + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span><button onClick={() => move(1)} aria-label={c(lang, "Next image", "الصورة التالية")}>→</button></div></div><div className="project-gallery-track" ref={gallery} onScroll={() => {
      const track = gallery.current; if (!track) return;
      const center = track.getBoundingClientRect().left + track.clientWidth / 2;
      let closest = 0, distance = Infinity;
      Array.from(track.children).forEach((el, i) => { const r = el.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - center); if (d < distance) { closest = i; distance = d; } }); setPhoto(closest);
    }}>{images.map((image, i) => <button key={image.src} aria-label={`${c(lang, "Open photograph", "افتح الصورة")} ${i + 1}`} onClick={() => { setPhoto(i); setLightbox(true); }}><ProjectImage project={p} index={i} lang={lang} sizes="(max-width:760px) 85vw, 70vw" /></button>)}</div><p className="project-gallery-hint">{c(lang, "SWIPE TO EXPLORE · SELECT A PHOTOGRAPH TO VIEW FULLSCREEN", "اسحب لمشاهدة الصور · اضغط لفتح الصورة كاملة")}</p></section>
    <section className="project-amenities paper-section"><div><span className="eyebrow">{c(lang, "LIFE AT", "الحياة في")} {p.name[lang]}</span><h2 className="display" data-reveal>{c(lang, "The details\nthat matter", "تفاصيل\nتصنع الفرق")}</h2><ul>{p.amenities[lang].map((a, i) => <li key={a}><span>0{i + 1}</span>{a}</li>)}</ul></div><div className="amenities-art" data-reveal><ProjectImage project={p} index={Math.min(1, images.length - 1)} lang={lang} sizes="50vw" /></div></section>
    <section className="project-location"><div className="location-art"><SatelliteThumb lat={p.lat} lng={p.lng} zoom={13} grid={3} alt={c(lang, "Satellite view of the project location", "صورة أقمار صناعية لموقع المشروع")} /><div className="location-pin"><Blossom /><span>{p.name[lang]}</span></div></div><div className="location-copy"><span className="eyebrow">{c(lang, "THE NEIGHBOURHOOD", "المنطقة المحيطة")}</span><h2 className="display">{p.area[lang]}</h2><p>{c(lang, "Put the project in perspective. Explore nearby education, healthcare, shopping and transport, with driving routes on our interactive map.", "شوف الصورة كاملة. استكشف التعليم والصحة والتسوق والمواصلات القريبة، مع مسارات القيادة على خريطتنا التفاعلية.")}</p>{p.areaApprox && <p>{STRINGS[lang].coordinatesApprox}</p>}<EditorialLink href={mapHref}>{c(lang, "Explore on the map", "استكشف على الخريطة")}</EditorialLink></div></section>
    <section className="project-documents paper-section"><span className="eyebrow">{c(lang, "TAKE A CLOSER LOOK", "كل التفاصيل")}</span><h2 className="display" data-reveal>{c(lang, "The finer details", "تفاصيل أكتر")}</h2>{media.brochure && <div className="document-row"><div><h3>{guide ? STRINGS[lang].projectGuide : STRINGS[lang].brochure}</h3><p>{guide ? STRINGS[lang].guideNote : c(lang, "Published project document. Open the PDF to explore the full information.", "مستند منشور للمشروع. افتح ملف PDF للاطلاع على التفاصيل.")}{media.brochureNote ? ` ${media.brochureNote[lang]}` : ""}</p></div><a className="editorial-link" href={media.brochure} target="_blank" rel="noreferrer"><span>{c(lang, "Open document", "افتح المستند")}</span><span className="link-flower"><Arrow diagonal /></span></a></div>}{p.url && <div className="document-row"><div><h3>{c(lang, "Project source", "مصدر المشروع")}</h3><p>{c(lang, "Project information and image sources are retained with each listing.", "مصادر معلومات وصور المشروع موضحة مع كل مشروع.")}</p></div><a className="editorial-link" href={p.url} target="_blank" rel="noreferrer"><span>{c(lang, "View source", "شوف المصدر")}</span><span className="link-flower"><Arrow diagonal /></span></a></div>}</section>
    <section className="project-enquiry paper-section"><Blossom /><h2 className="display" data-reveal>{c(lang, "Your next chapter?", "بدايتك الجديدة؟")}</h2><EditorialLink href={siteHref(`/contact?project=${p.id}`, lang)}>{c(lang, "Enquire about this project", "استفسر عن المشروع")}</EditorialLink></section>
    <section className="next-project"><ProjectImage project={next} lang={lang} sizes="100vw" /><Link href={siteHref(`/projects/${next.id}`, lang)}><span className="eyebrow">{c(lang, "THE NEXT DESTINATION", "الوجهة التالية")}</span><h2 className="display">{next.name[lang]}</h2><Arrow diagonal /></Link></section>
    {lightbox && createPortal(<div className="estate-lightbox" role="dialog" aria-modal="true" aria-label={`${p.name[lang]} — ${c(lang, "Photographs", "الصور")}`} ref={dialog} onClick={e => { if (e.target === e.currentTarget) setLightbox(false); }}><button className="lightbox-close" aria-label={c(lang, "Close photographs", "إغلاق الصور")} onClick={() => setLightbox(false)}>×</button><ProjectImage project={p} index={photo} lang={lang} eager sizes="100vw" /><button className="lightbox-prev" aria-label={c(lang, "Previous image", "الصورة السابقة")} onClick={() => move(-1)}>←</button><button className="lightbox-next" aria-label={c(lang, "Next image", "الصورة التالية")} onClick={() => move(1)}>→</button><span className="lightbox-caption">{p.name[lang]} · {photo + 1} / {images.length}</span></div>, document.body)}
  </>;
}
