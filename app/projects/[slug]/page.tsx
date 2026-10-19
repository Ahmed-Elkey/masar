import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/estate/SiteShell';
import ProjectDetail from '@/components/estate/ProjectDetail';
import { PROJECTS } from '@/lib/data';
import { c, language } from '@/lib/estate';
import { BRAND } from '@/lib/i18n';
import media from '@/lib/media.json';
export function generateStaticParams(){return PROJECTS.map(p=>({slug:p.id}))}
export function generateMetadata({params,searchParams}:{params:{slug:string};searchParams:Record<string,string|string[]|undefined>}):Metadata{const p=PROJECTS.find(p=>p.id===params.slug),lang=language(searchParams);return p?{title:`${p.name[lang]} — ${BRAND[lang].credit}`,description:p.description[lang]}:{title:c(lang,'Project not found — Nile Estates','المشروع مش موجود — نايل إستيتس')}}
export default function Page({params,searchParams}:{params:{slug:string};searchParams:Record<string,string|string[]|undefined>}){const p=PROJECTS.find(p=>p.id===params.slug);if(!p)notFound();const lang=language(searchParams),site=process.env.NEXT_PUBLIC_SITE_URL??'http://localhost:3000';const images=(media as Record<string,{images:{src:string}[]}>)[p.id]?.images??[];const json={'@context':'https://schema.org','@type':'RealEstateListing',name:p.name[lang],description:p.description[lang],url:`${site}/projects/${p.id}`,image:images.slice(0,3).map(i=>new URL(i.src,site).toString()),geo:{'@type':'GeoCoordinates',latitude:p.lat,longitude:p.lng},address:{'@type':'PostalAddress',addressLocality:p.area[lang],addressCountry:'EG'}};return <SiteShell lang={lang}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(json).replace(/</g,'\\u003c')}}/><ProjectDetail project={p} lang={lang}/></SiteShell>}
