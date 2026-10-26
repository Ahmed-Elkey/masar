"use client";
import {useEffect,useRef} from "react";
import ProjectImage from "@/components/ProjectImage";
import {useProjects} from "./CatalogueProvider";
import type {Lang} from "@/lib/types";
export default function AboutPortal({lang}:{lang:Lang}){
 const PROJECTS=useProjects();
 const stage=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const root=stage.current;if(!root)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const paint=()=>{frame=0;const r=root.getBoundingClientRect(),travel=Math.max(1,r.height-innerHeight);const p=reduced.matches?1:Math.max(0,Math.min(1,-r.top/(travel*.85)));const eased=p*p*(3-2*p);root.style.setProperty('--portal-open',String(eased));};
  const update=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  paint();addEventListener('scroll',update,{passive:true});addEventListener('resize',update);reduced.addEventListener('change',update);
  return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',update);removeEventListener('resize',update);reduced.removeEventListener('change',update);};
 },[]);
 return <div className="about-portal" ref={stage}><div className="about-portal-sticky"><div className="about-portal-window"><ProjectImage project={PROJECTS.find(p=>p.id==='mivida')!} index={4} eager lang={lang} sizes="100vw"/></div></div></div>;
}
