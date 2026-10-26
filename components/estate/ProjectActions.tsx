"use client";
import {useProjects} from "./CatalogueProvider";
import {useState} from 'react';
import Link from 'next/link';
import type {Lang} from '@/lib/types';
import {useShortlist} from '@/lib/shortlist';
import {c,siteHref} from '@/lib/estate';
export default function ProjectActions({id,lang}:{id:string;lang:Lang}){
 const PROJECTS=useProjects();
 const list=useShortlist(),[note,setNote]=useState(''),name=PROJECTS.find(p=>p.id===id)?.name[lang]??'';
 return <div className="project-actions"><button aria-label={c(lang,list.saved.includes(id)?`Unsave ${name}`:`Save ${name}`,list.saved.includes(id)?`إلغاء حفظ ${name}`:`احفظ ${name}`)} aria-pressed={list.saved.includes(id)} onClick={()=>{list.toggle(id,'saved');setNote('');}}>{list.saved.includes(id)?'♥':'♡'} {c(lang,list.saved.includes(id)?'Saved':'Save',list.saved.includes(id)?'محفوظ':'احفظ المشروع')}</button><button aria-label={c(lang,list.compare.includes(id)?`Remove ${name} from comparison`:`Compare ${name}`,list.compare.includes(id)?`احذف ${name} من المقارنة`:`قارن ${name}`)} aria-pressed={list.compare.includes(id)} onClick={()=>setNote(list.toggle(id,'compare')?'':c(lang,'Compare up to 3 projects. Remove one from your planner first.','المقارنة لحد ٣ مشاريع. احذف مشروع من قائمة المقارنة الأول.'))}>{list.compare.includes(id)?'✓':'+'} {c(lang,'Compare','قارن')}</button><Link href={siteHref('/planner',lang)}>{c(lang,'My planner','اختياراتي')} ({list.saved.length}) ↗</Link>{(note||list.storageError)&&<span role="status">{note||c(lang,'Browser storage is unavailable. Export your choices before leaving.','الحفظ في المتصفح مش متاح. نزّل اختياراتك قبل ما تخرج.')}</span>}</div>;
}
