"use client";
import {useState,useEffect,useRef} from "react";
import Link from "next/link";
import ProjectImage from "@/components/ProjectImage";
import {PROJECTS} from "@/lib/data";
import {DESTINATIONS,c,siteHref} from "@/lib/estate";
import type {Lang} from "@/lib/types";
import {Blossom} from "./Brand";
import Contact from "./Contact";
import {PROJECT_EMAIL, PROJECT_EMAIL_ENABLED} from "@/lib/contact";

export default function ContactLayout({lang,initialProject="any"}:{lang:Lang;initialProject?:string}){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.querySelectorAll("[data-reveal]").forEach(el=>el.classList.add("is-revealed"));observer.unobserve(entry.target);}}),{threshold:.01});
  const parents=new Set([...root.current?.querySelectorAll("[data-reveal]")??[]].map(el=>el.parentElement).filter((el):el is HTMLElement=>!!el));
  parents.forEach(el=>observer.observe(el));return()=>observer.disconnect();
 },[]);
 const [open,setOpen]=useState(initialProject!=="any");
 const email=PROJECT_EMAIL;
 const enquiry=c(lang,"PREPARE AN ENQUIRY","\u062c\u0647\u0651\u0632 \u0627\u0633\u062a\u0641\u0633\u0627\u0631\u0643");
 return <div className="reference-contact" ref={root}><section className="contact-blue">
  <nav className="contact-breadcrumb" aria-label="Breadcrumb"><Link href={siteHref("/",lang)}>{c(lang,"HOME","\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629")}</Link><span>/</span><span>{c(lang,"CONTACT","\u0627\u0644\u062a\u0648\u0627\u0635\u0644")}</span></nav>
  <h1 className="display contact-reveal-title">{c(lang,"CONTACT US","\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0627\u0646\u0627")}</h1>
  <div className="contact-info-grid">
   <div data-reveal><h2>{c(lang,"NO ACCOUNTS","\u0645\u0646 \u063a\u064a\u0631 \u062d\u0633\u0627\u0628\u0627\u062a")}</h2>{PROJECT_EMAIL_ENABLED ? <p className="contact-email">{email}</p> : <p>{c(lang,"Nothing to sign up for and nothing gets sent to us. Build a brief on this page and it stays on your device.","مفيش حساب بتعمله ومفيش حاجة بتتبعتلنا. الملخص اللي بتكتبه هنا بيفضل على جهازك.")}</p>}</div>
   <div data-reveal><h2>{c(lang,"OUR DESTINATIONS","\u0648\u062c\u0647\u0627\u062a\u0646\u0627")}</h2><p>{DESTINATIONS.map(d=>c(lang,d.en,d.ar)).join(" / ")}</p><h2>{c(lang,"LOCATION","\u0627\u0644\u0645\u0648\u0642\u0639")}</h2><Link href={siteHref("/map",lang)}>{c(lang,"EXPLORE EGYPT ON THE MAP","\u0627\u0633\u062a\u0643\u0634\u0641 \u0645\u0635\u0631 \u0639\u0644\u0649 \u0627\u0644\u062e\u0631\u064a\u0637\u0629")} &#8599;</Link></div>
   <div data-reveal><h2>{c(lang,"LET'S BEGIN","\u0646\u0628\u062f\u0623 \u0627\u0644\u062d\u0643\u0627\u064a\u0629")}</h2><a href="#contact-enquiry" onClick={()=>setOpen(true)}>{enquiry}</a><Link href={siteHref("/projects",lang)}>{c(lang,"EXPLORE THE COLLECTION","\u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639")} &#8599;</Link></div>
  </div>
  <div className="contact-atlas" data-reveal><svg viewBox="0 0 1400 750" role="img" aria-label={c(lang,"Illustrated Egyptian destinations","\u0631\u0633\u0645 \u062a\u0648\u0636\u064a\u062d\u064a \u0644\u0648\u062c\u0647\u0627\u062a \u0645\u0635\u0631")}>
   <defs><linearGradient id="contact-map-fade" x2="0" y2="1"><stop stopColor="#9bb9c6" stopOpacity=".35"/><stop offset="1" stopColor="#9bb9c6" stopOpacity="0"/></linearGradient></defs>
   <path className="atlas-sea" d="M0 0H1400V90Q1260 140 1150 105T920 100T700 100T500 130T250 150T0 190Z"/>
   <g className="atlas-contours">{Array.from({length:11},(_,i)=><path key={i} d={`M${90+i*27} 210Q${300+i*17} ${120+i*24} ${470+i*26} 280T${1000+i*20} ${430+i*21}`}/>)}</g>
   <path className="atlas-boundary" d="M220 175 650 155 800 183 860 160 1030 190 1110 250 1060 340 990 355 925 285 865 240 850 310 920 440 1010 610H220Z"/>
   <path className="atlas-nile" d="M720 610Q760 535 725 465T735 345T730 230L680 175M730 230 775 175"/>
   <path className="atlas-road" d="M350 170Q500 120 680 175T855 240M630 290Q690 240 770 215T870 200"/>
   {DESTINATIONS.map((d,i)=>{const [x,y]=[[782,239],[470,163],[651,251],[874,267],[603,288]][i];return <g key={d.id}><circle cx={x} cy={y} r="12" className="atlas-ring"/><circle cx={x} cy={y} r="4"/><text x={x+(i%2?-18:18)} y={y+(i%2?-20:24)} textAnchor={i%2?"end":"start"}>{c(lang,d.en,d.ar)}</text></g>;})}
   <text className="atlas-egypt" x="465" y="480">EGYPT</text><text className="atlas-water-label" x="600" y="78">MEDITERRANEAN SEA</text>
  </svg><Link className="contact-map-marker" href={siteHref("/map",lang)}><span>NILE ESTATES<small>{c(lang,"FIND YOUR PLACE IN EGYPT","\u0627\u0643\u062a\u0634\u0641 \u0645\u0643\u0627\u0646\u0643 \u0641\u064a \u0645\u0635\u0631")}</small></span><Blossom/></Link>
  <a className="contact-round" href="#contact-enquiry" onClick={()=>setOpen(true)}><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98"/><circle cx="100" cy="100" r="98"/></svg><span>{enquiry}</span></a></div>
  <details className="contact-enquiry" id="contact-enquiry" open={open} onToggle={event=>setOpen(event.currentTarget.open)}><summary>{enquiry}<span>{open?"-":"+"}</span></summary><Contact lang={lang} initialProject={initialProject}/></details>
 </section><section className="contact-scenic"><div className="contact-scenic-image"><ProjectImage project={PROJECTS.find(p=>p.id==="fouka-bay")!} index={1} lang={lang} sizes="100vw"/></div><div className="contact-scenic-content"><p data-reveal>{c(lang,"A short conversation can begin your next chapter. Tell us the places and the way of living you have in mind.","\u0642\u0648\u0644 \u0644\u0646\u0627 \u0639\u0646 \u0627\u0644\u0623\u0645\u0627\u0643\u0646 \u0648\u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u062d\u064a\u0627\u0629 \u0627\u0644\u0644\u064a \u0628\u062a\u062f\u0648\u0631 \u0639\u0644\u064a\u0647.")}</p><h2 className="display" data-reveal>{c(lang,"FIND YOUR","\u0627\u0643\u062a\u0634\u0641")}<br/>{c(lang,"PERSPECTIVE","\u0645\u0643\u0627\u0646\u0643")}</h2><span className="eyebrow">{c(lang,"PLACES TO LIVE. PLACES TO RETURN TO.","\u0623\u0645\u0627\u0643\u0646 \u0644\u0644\u062d\u064a\u0627\u0629. \u0648\u0623\u0645\u0627\u0643\u0646 \u062a\u062d\u0628 \u062a\u0631\u062c\u0639 \u0644\u0647\u0627.")}</span><Link className="contact-round" href={siteHref("/projects",lang)}><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="98"/><circle cx="100" cy="100" r="98"/></svg><span>{c(lang,"EXPLORE THE COLLECTION","\u0627\u0633\u062a\u0643\u0634\u0641 \u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639")}</span></Link></div></section></div>;
}
