"use client";

import Link from "next/link";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";
import { PROJECTS } from "@/lib/data";
import { DESTINATIONS, FEATURED, c, siteHref } from "@/lib/estate";
import ProjectImage from "@/components/ProjectImage";
import { Blossom } from "./Brand";
import HorizontalSequence from "./HorizontalSequence";

function MotionText({ children, className = "", as = "h2" }: { children: string; className?: string; as?: "h2" | "h3" | "p" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setShown(true); observer.disconnect(); } }, { threshold: .2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const Tag = as;
  return <Tag ref={ref} className={`lower-text ${shown ? "shown" : ""} ${className}`} aria-label={children}>{children.split(" ").map((word, i) => <span className="lower-word" aria-hidden="true" key={i}><span style={{ "--delay": `${Math.min(i * 35, 700)}ms` } as CSSProperties}>{word}</span>{" "}</span>)}</Tag>;
}
function RoundLink({ href, children }: { href: string; children: ReactNode }) { return <Link className="round-link" href={href}><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98" /><circle cx="100" cy="100" r="98" /></svg><span>{children}</span></Link>; }
function Foliage({ className = "" }: { className?: string }) {
  return <svg className={`lower-foliage ${className}`} viewBox="0 0 400 500" fill="none" aria-hidden="true"><path d="M-30 0Q330 100 190 520M0 60Q80 190 340 225M45 30Q250 50 395 365" stroke="#7c8570" strokeWidth="2" />{Array.from({length:24},(_,i)=>{const x=28+(i*73)%340,y=20+(i*97)%435;return <g key={i} transform={`translate(${x} ${y}) rotate(${i*41})`}><ellipse rx="12" ry="29" fill={i%2 ? "#888b6b" : "#616e54"} transform="rotate(35) translate(8 -12)"/><path d="M0 -18C24 -32 36 -2 10 8C34 30 3 45 -6 18C-30 35 -40 5 -15 -2C-37 -20 -10 -40 0 -18Z" fill={i%3 ? "#ad6985" : "#ce93aa"}/><circle r="4" fill="#e5c7b0"/></g>;})}</svg>;
}
function ScrollStage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => { frame = 0; const el=ref.current; if (!el) return; const r=el.getBoundingClientRect(); const progress=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-innerHeight))); el.style.setProperty("--stage",String(progress)); el.dataset.full=String(progress>.95); };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule);update();
    return()=>{removeEventListener("scroll",schedule);removeEventListener("resize",schedule);cancelAnimationFrame(frame);};
  },[]);
  return <section ref={ref} className={`lower-scroll-stage ${className}`}>{children}</section>;
}
export default function LowerHome({lang}:{lang:Lang}) {
  const [destination,setDestination]=useState(0);
  const [project,setProject]=useState(0);
  const [projectPaused,setProjectPaused]=useState(false);
  const [projectPhase,setProjectPhase]=useState("idle");
  const [service,setService]=useState(0);
  const [interior,setInterior]=useState(0);
  const [pan,setPan]=useState(50);
  const busy=useRef(false),timers=useRef<ReturnType<typeof setTimeout>[]>([]);
  const collection=useRef<HTMLElement>(null);
  const panorama=useRef<HTMLDivElement>(null);
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
  const changeProject=(index:number)=>{
    if(busy.current || index===project)return;
    if(matchMedia("(prefers-reduced-motion: reduce)").matches){setProject(index);return;}
    busy.current=true;setProjectPhase("out");
    timers.current.push(setTimeout(()=>{setProject(index);setProjectPhase("in");timers.current.push(setTimeout(()=>{setProjectPhase("idle");busy.current=false;},1000));},600));
  };
  useEffect(()=>{
    const el=collection.current;if(!el)return;
    let timer:ReturnType<typeof setInterval>|undefined;
    const observer=new IntersectionObserver(([entry])=>{
      clearInterval(timer);
      if(entry.isIntersecting&&!projectPaused&&!matchMedia("(prefers-reduced-motion: reduce)").matches)timer=setInterval(()=>{if(!document.hidden)changeProject((project+1)%FEATURED.length);},7800);
    },{threshold:.4});observer.observe(el);
    return()=>{observer.disconnect();clearInterval(timer);};
  },[project,projectPaused]);
  const place=DESTINATIONS[destination], placeProject=PROJECTS.find(p=>p.id===place.id)!;
  const selected=FEATURED[project];
  const services=[
    {id:"garden-lakes",en:"Garden living",ar:"وسط الحدائق",body:"Gardens, open spaces and places to slow down.",bodyAr:"حدائق ومساحات مفتوحة وإيقاع أهدى للحياة."},
    {id:"fouka-bay",en:"Beside the water",ar:"قرب المياه",body:"A different pace, from the first light to the last swim.",bodyAr:"حياة بإيقاع مختلف من أول ضوء لآخر لحظة على الشاطئ."},
    {id:"mivida",en:"Connected neighbourhoods",ar:"حياة متكاملة",body:"Discover the schools, shops and daily connections around home.",bodyAr:"اكتشف المدارس والمحلات والخدمات القريبة من بيتك."},
  ];
  return <div className="lower-home">
    <HorizontalSequence><section className="lower-concept" id="perspective"><Foliage /><span className="eyebrow">{c(lang,"THE CONCEPT","الفكرة")}</span><MotionText className="display">{c(lang,"One considered collection of places across Egypt, brought together around the way you want to live.","مجموعة مختارة من الوجهات في مصر، بتجمعها رؤية واحدة: الحياة اللي تناسبك.")}</MotionText><p data-reveal>{c(lang,"Nile Estates brings projects, photographs and their surroundings into one experience. From city neighbourhoods to coastal retreats, discover your next address in context.","نايل إستيتس بتجمع المشاريع وصورها والمناطق المحيطة بيها في تجربة واحدة. من أحياء المدينة لوجهات البحر، اكتشف عنوانك القادم بكل تفاصيله.")}</p><Blossom /></section>

    <section className="lower-destination" id="destinations"><Foliage className="bottom" /><div className="lower-destination-image" key={place.id}><ProjectImage project={placeProject} lang={lang} sizes="(max-width:760px) 90vw, 45vw" /></div><div className="lower-destination-title"><span className="eyebrow">{c(lang,"EGYPT","مصر")}</span><h2 className="display" key={place.id}>{c(lang,place.en,place.ar).split(" ").map((word,i)=><span key={i}>{word}</span>)}</h2></div><nav className="lower-destination-tabs" aria-label={c(lang,"Choose a destination","اختار وجهتك")}>{DESTINATIONS.map((d,i)=><button key={d.id} aria-pressed={destination===i} onClick={()=>setDestination(i)}>{c(lang,d.en,d.ar)}</button>)}</nav><div className="lower-destination-copy"><MotionText as="h3" className="display">{c(lang,"Find your own rhythm","اكتشف الإيقاع اللي يشبهك")}</MotionText><p>{c(lang,"Understand the setting before choosing the address. Explore each destination, compare the surroundings and see where everyday life connects.","افهم المكان قبل ما تختار العنوان. اكتشف كل وجهة وقارن المناطق المحيطة وشوف تفاصيل الحياة اليومية.")}</p><Link className="lower-pill" href={siteHref(`/projects?area=${encodeURIComponent(place.area)}`,lang)}>{c(lang,"DISCOVER THE DESTINATION","اكتشف الوجهة")} ↗</Link></div></section>

    <section className="lower-coastline"><Foliage className="right" /><MotionText className="display">{c(lang,"The place you imagined","المكان اللي بتتخيله")}</MotionText><em>{c(lang,"Yours","مكانك")}</em><span className="display">{c(lang,"A new chapter","بداية جديدة")}</span><RoundLink href={siteHref("/map",lang)}>{c(lang,"EXPLORE THE MAP","استكشف الخريطة")}</RoundLink><div className="destination-line"><svg viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 100Q100 90 150 45T320 70T470 40T650 90T800 55T970 80T1200 35" /></svg>{DESTINATIONS.map((d,i)=><Link key={d.id} href={siteHref(`/projects?area=${encodeURIComponent(d.area)}`,lang)} style={{"--pin":i} as CSSProperties}><span>{c(lang,d.en,d.ar)}</span><i /></Link>)}</div></section>

    </HorizontalSequence>

    <section className="lower-panorama" aria-label={c(lang,"Explore the destination view","استكشف مشهد الوجهة")}><div className="panorama-heading"><span className="eyebrow">{c(lang,place.en,place.ar)} · {c(lang,"EGYPT","مصر")}</span><span className="display">{c(lang,place.caption,place.captionAr)}</span><em>{c(lang,"A different perspective","من منظور مختلف")}</em></div><div className="panorama-view" ref={panorama} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);}} onPointerMove={event=>{if(!event.currentTarget.hasPointerCapture(event.pointerId))return;const r=event.currentTarget.getBoundingClientRect();setPan(Math.max(0,Math.min(100,(event.clientX-r.left)/r.width*100)));}}><div style={{"--pan":`${pan}%`} as CSSProperties}><ProjectImage project={placeProject} index={placeProject.id === "mivida" ? 4 : 1} lang={lang} sizes="115vw" /></div><span className="panorama-hint">↔ {c(lang,"DRAG TO EXPLORE","اسحب لاستكشاف المشهد")}</span></div><input type="range" min="0" max="100" value={pan} onChange={e=>setPan(Number(e.target.value))} aria-label={c(lang,"Pan destination photograph","تحريك صورة الوجهة")} /></section>

    <section className="lower-collection" ref={collection} id="collection"><div className="reason-preload" aria-hidden="true">{FEATURED.map(p=><ProjectImage key={p.id} project={p} lang={lang} eager sizes="(max-width:760px) 72vw, 30vw" />)}</div><div className="lower-project-content" data-phase={projectPhase}><div className="lower-project-facts"><span className="eyebrow">{c(lang,"DESTINATION","الوجهة")}</span><span className="display">{selected.area[lang]}</span><span className="eyebrow">{c(lang,"DEVELOPER","المطور")}</span><span className="display">{selected.developer}</span></div><div className="lower-project-image" key={selected.id}><ProjectImage project={selected} lang={lang} sizes="(max-width:760px) 72vw, 30vw" eager /></div><div className="lower-project-description"><p>{selected.description[lang]}</p><Link className="lower-pill" href={siteHref(`/projects/${selected.id}`,lang)}>{c(lang,"EXPLORE","اكتشف")} {selected.name[lang]} ↗</Link></div><h2 className="display" key={`name-${selected.id}`}>{selected.name[lang]}</h2></div><div className="lower-pager"><button aria-label={c(lang,"Previous project","المشروع السابق")} onClick={()=>changeProject((project+FEATURED.length-1)%FEATURED.length)}>‹</button><span>{project+1}</span><div>{FEATURED.map((p,i)=><button key={p.id} aria-label={p.name[lang]} aria-pressed={i===project} onClick={()=>changeProject(i)}><i /></button>)}</div><span>{FEATURED.length}</span><button aria-label={c(lang,"Next project","المشروع التالي")} onClick={()=>changeProject((project+1)%FEATURED.length)}>›</button></div><button className="reason-playback" aria-pressed={projectPaused} onClick={()=>setProjectPaused(value=>!value)}>{c(lang,projectPaused?"RESUME STORIES ▷":"PAUSE STORIES Ⅱ",projectPaused?"تشغيل العرض ▷":"إيقاف العرض Ⅱ")}</button><Link className="lower-all" href={siteHref("/projects",lang)}>{c(lang,"VIEW THE FULL COLLECTION","كل المشاريع")} ({PROJECTS.length}) ↗</Link></section>

    <section className="lower-collection-statement"><span className="eyebrow">{c(lang,"A PLACE TO LIVE — TO RETURN YEAR AFTER YEAR","مكان للحياة — تحب ترجع له كل سنة")}</span><MotionText className="display">{c(lang,"From gardens to the coastline, explore different settings for your next chapter.","من الحدائق لشاطئ البحر، اكتشف أماكن مختلفة لفصلك الجديد.")}</MotionText><div className="lower-mosaic"><div data-reveal><ProjectImage project={FEATURED[0]} index={1} lang={lang} sizes="35vw" /></div><Blossom /><div data-reveal><ProjectImage project={FEATURED[1]} index={1} lang={lang} sizes="35vw" /></div></div></section>

    <section className="living-section lower-amenities"><div className="lower-amenities-background" key={`bg-${service}`}><ProjectImage project={PROJECTS.find(p=>p.id===services[service].id)!} lang={lang} sizes="100vw" /></div><div className="lower-amenities-copy" key={`copy-${service}`}><MotionText as="h3" className="display">{c(lang,services[service].en,services[service].ar)}</MotionText><p>{c(lang,services[service].body,services[service].bodyAr)}</p><RoundLink href={siteHref(`/projects/${services[service].id}`,lang)}>{c(lang,"DISCOVER THE PROJECT","اكتشف المشروع")}</RoundLink></div><nav aria-label={c(lang,"Explore ways of living","اكتشف أسلوب الحياة")}>{services.map((s,i)=><button key={s.id} aria-pressed={service===i} onMouseEnter={()=>setService(i)} onFocus={()=>setService(i)} onClick={()=>setService(i)}>{c(lang,s.en,s.ar)}</button>)}</nav></section>

    <section className="lower-everyday" id="everyday"><div className="lower-everyday-heading"><MotionText className="display">{c(lang,"The space to","مساحة عشان")}</MotionText><em>{c(lang,"Live in","تعيش")}</em></div><div className="lower-everyday-first"><div data-reveal><ProjectImage project={PROJECTS.find(p=>p.id==="garden-lakes")!} lang={lang} sizes="55vw" /></div><p className="eyebrow">{c(lang,"GARDENS. OPEN SPACES. ROOM TO SLOW DOWN.","حدائق. مساحات مفتوحة. وإيقاع أهدى للحياة.")}</p></div><div className="lower-interior-image" key={interior}><ProjectImage project={PROJECTS.find(p=>p.id==="garden-lakes")!} index={interior+1} lang={lang} sizes="85vw" /></div><div className="lower-pager"><button aria-label={c(lang,"Previous photograph","الصورة السابقة")} onClick={()=>setInterior((interior+2)%3)}>‹</button><span>{interior+1}</span><div>{[0,1,2].map(i=><button key={i} aria-label={c(lang,`Photograph ${i+1}`,`صورة ${i+1}`)} aria-pressed={interior===i} onClick={()=>setInterior(i)}><i /></button>)}</div><span>3</span><button aria-label={c(lang,"Next photograph","الصورة التالية")} onClick={()=>setInterior((interior+1)%3)}>›</button></div><div className="lower-everyday-bottom"><div data-reveal><ProjectImage project={FEATURED[1]} index={2} lang={lang} sizes="38vw" /></div><div><MotionText as="h3" className="display">{c(lang,"Find the everyday you have been imagining.","اكتشف الحياة اللي بتتخيلها.")}</MotionText><p>{c(lang,"A morning among gardens. An afternoon by the sea. A neighbourhood that brings everything closer. Discover the settings for your next chapter.","صباح وسط الحدائق. عصر على البحر. ومنطقة تقرّبك من كل حاجة. اكتشف المكان المناسب لفصلك الجديد.")}</p><RoundLink href={siteHref("/projects",lang)}>{c(lang,"EXPLORE THE COLLECTION","استكشف المشاريع")}</RoundLink></div></div></section>

    <ScrollStage className="lower-architecture"><div className="lower-architecture-sticky"><div className="lower-architecture-photo"><ProjectImage project={PROJECTS.find(p=>p.id==="ivoire-west")!} lang={lang} sizes="100vw" /></div><h2 className="display">{c(lang,"Architecture","العمارة")}</h2><div className="lower-architecture-copy"><MotionText as="h3" className="display">{c(lang,"Considered spaces. Different perspectives. Places that feel like home.","مساحات مدروسة. وجهات مختلفة. وأماكن تشبهك.")}</MotionText><span className="eyebrow">{c(lang,"NILE ESTATES · EGYPT","نايل إستيتس · مصر")}</span><RoundLink href={siteHref("/projects",lang)}>{c(lang,"VIEW THE COLLECTION","شوف المشاريع")}</RoundLink></div></div></ScrollStage>

    <section className="lower-information"><span className="eyebrow">{c(lang,"EVERY PLACE. ONE PERSPECTIVE.","كل الأماكن. من منظور واحد.")}</span>{[["THE COLLECTION","المشاريع"],["THE DESTINATIONS","الوجهات"],["THE DETAILS","التفاصيل"],["YOUR NEXT STEP","خطوتك الجاية"]].map(([en,ar],i)=><div key={en} data-reveal><h3 className="display">{c(lang,en,ar)}</h3><p>{[c(lang,`${PROJECTS.length} residential projects across Egypt, brought together in one place.`,`${PROJECTS.length} مشروع سكني في مصر، في مكان واحد.`),c(lang,"Explore New Cairo, the North Coast, Sheikh Zayed, the New Capital and 6th of October.","اكتشف القاهرة الجديدة والساحل الشمالي والشيخ زايد والعاصمة الإدارية و٦ أكتوبر."),c(lang,"Project imagery, brochures and surroundings help you understand the places you are exploring.","صور المشاريع والبروشورات والمناطق المحيطة بتساعدك تفهم كل وجهة."),c(lang,"Explore the map or get in touch to tell us what you are looking for.","استكشف الخريطة أو تواصل معانا وقول لنا بتدوّر على إيه.")][i]}</p></div>)}</section>

    <ScrollStage className="lower-finale"><div className="lower-finale-sticky"><div className="lower-finale-photo"><ProjectImage project={FEATURED[1]} lang={lang} index={1} sizes="100vw" /></div><div className="lower-finale-heading"><p>{c(lang,"Your next chapter starts with a place. Discover the settings, explore the surroundings and find your perspective.","فصلك الجديد بيبدأ بمكان. اكتشف الوجهات والمناطق المحيطة واختار المكان اللي يشبهك.")}</p><MotionText className="display">{c(lang,"A place to return to","مكان تحب ترجع له")}</MotionText><span className="eyebrow">{c(lang,"EXPLORE EGYPT. FIND YOUR PLACE.","اكتشف مصر. واختار مكانك.")}</span><RoundLink href={siteHref("/map",lang)}>{c(lang,"ENTER THE MAP","افتح الخريطة")}</RoundLink></div></div></ScrollStage>
  </div>;
}
