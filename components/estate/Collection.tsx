"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PROJECTS } from "@/lib/data";
import { STRINGS } from "@/lib/i18n";
import type { Lang, StatusId } from "@/lib/types";
import ProjectImage from "@/components/ProjectImage";
import { Arrow } from "./Brand";
import { c, siteHref } from "./SiteShell";

export default function Collection({ lang, initialArea = "all", initialQuery = "" }: { lang: Lang; initialArea?: string; initialQuery?: string }) {
  const [area, setArea] = useState(initialArea);
  const [query, setQuery] = useState(initialQuery);
  const [developer, setDeveloper] = useState("all");
  const [status, setStatus] = useState("all");
  const [list, setList] = useState(false);
  const areas = useMemo(() => [...new Set(PROJECTS.map(p => p.area.en))].sort(), []);
  const developers = useMemo(() => [...new Set(PROJECTS.map(p => p.developer))].sort(), []);
  const projects = PROJECTS.filter(p => (area === "all" || p.area.en === area) && (developer === "all" || p.developer === developer) && (status === "all" || p.status === status) && (!query || [p.name.en, p.name.ar, p.area.en, p.area.ar, p.developer].some(v => v.toLowerCase().includes(query.toLowerCase()))));
  useEffect(() => {
    const url = new URL(location.href);
    if (area !== "all") url.searchParams.set("area", area); else url.searchParams.delete("area");
    if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
    history.replaceState(null, "", url.toString());
  }, [area, query]);
  return <>
    <section className="collection-intro"><span className="eyebrow">{c(lang, "RESIDENTIAL DESTINATIONS · EGYPT", "وجهات سكنية · مصر")}</span><h1 className="display">{c(lang, "THE COLLECTION", "المشاريع")}<em>{c(lang, "Find your place", "اكتشف مكانك")}</em></h1><p>{c(lang, "Different destinations. Different possibilities. Find the place that feels like your next chapter.", "وجهات مختلفة وفرص جديدة. اكتشف المكان اللي يناسب فصلك القادم.")}</p></section>
    <div className="collection-toolbar" role="search" aria-label={c(lang, "Find projects", "ابحث عن المشاريع")}>
      <label className="collection-search"><span>{c(lang, "Search projects", "ابحث عن مشروع")}</span><span aria-hidden="true">⌕</span><input aria-label={c(lang, "Search projects", "ابحث عن مشروع")} placeholder={c(lang, "Search by name or destination", "ابحث بالاسم أو المنطقة")} value={query} onChange={e => setQuery(e.target.value)} /></label>
      <label><span>{c(lang, "Destination", "المنطقة")}</span><select value={area} onChange={e => setArea(e.target.value)} aria-label={c(lang, "Destination", "المنطقة")}><option value="all">{c(lang, "All destinations", "كل المناطق")}</option>{areas.map(a => <option key={a} value={a}>{PROJECTS.find(p => p.area.en === a)!.area[lang]}</option>)}</select></label>
      <label><span>{c(lang, "Developer", "المطوّر")}</span><select value={developer} onChange={e => setDeveloper(e.target.value)} aria-label={c(lang, "Developer", "المطوّر")}><option value="all">{c(lang, "All developers", "كل المطورين")}</option>{developers.map(d => <option key={d}>{d}</option>)}</select></label>
      <label><span>{c(lang, "Project status", "حالة المشروع")}</span><select value={status} onChange={e => setStatus(e.target.value)} aria-label={c(lang, "Project status", "حالة المشروع")}><option value="all">{c(lang, "All statuses", "كل الحالات")}</option>{["underConstruction", "ready", "delivered"].map(s => <option key={s} value={s}>{STRINGS[lang].status[s as StatusId]}</option>)}</select></label>
      <div className="view-switch"><button aria-label={c(lang, "Grid view", "عرض شبكي")} aria-pressed={!list} onClick={() => setList(false)}>⊞</button><button aria-label={c(lang, "List view", "عرض قائمة")} aria-pressed={list} onClick={() => setList(true)}>☰</button></div>
    </div>
    <div className="collection-meta"><span aria-live="polite">{String(projects.length).padStart(2, "0")} {c(lang, "PLACES TO DISCOVER", "مشروع للاستكشاف")}</span>{(area !== "all" || developer !== "all" || status !== "all" || query) && <button onClick={() => { setArea("all"); setDeveloper("all"); setStatus("all"); setQuery(""); }}>{c(lang, "Clear filters", "مسح الفلاتر")} ×</button>}<Link href={siteHref("/map", lang)}>{c(lang, "VIEW ON THE MAP", "عرض على الخريطة")} ↗</Link></div>
    <section className={`collection-grid${list ? " list-view" : ""}`} aria-label={c(lang, "Projects", "المشاريع")}>{projects.map((p, i) => <Link key={p.id} className="collection-card" href={siteHref(`/projects/${p.id}`, lang)}><div className="collection-photo"><ProjectImage project={p} lang={lang} eager={i < 2} sizes="(max-width:760px) 85vw, 40vw" /><span>{STRINGS[lang].status[p.status]}</span><span className="project-view"><Arrow diagonal />{c(lang, "DISCOVER", "اكتشف")}</span></div><div className="card-number"><span>{String(i + 1).padStart(2, "0")}</span><Arrow diagonal /></div><h2 className="display">{p.name[lang]}</h2><div className="card-meta"><span>{p.area[lang]}</span><span>{p.developer}</span></div></Link>)}{!projects.length && <div className="collection-empty"><h2 className="display">{c(lang, "A little further afield?", "نجرب اختيار تاني؟")}</h2><p>{c(lang, "No projects match these filters. Try another destination or search.", "مفيش مشاريع مطابقة للفلاتر دي. جرّب منطقة أو بحث مختلف.")}</p></div>}</section>
  </>;
}
