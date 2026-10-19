import type { Metadata } from 'next';
import SiteShell from '@/components/estate/SiteShell';
import Collection from '@/components/estate/Collection';
import { language } from '@/lib/estate';
export const metadata: Metadata={title:'The Collection — Nile Estates',description:'Explore 23 residential projects across Egypt.'};
export default function Page({searchParams}:{searchParams:Record<string,string|string[]|undefined>}){const lang=language(searchParams);return <SiteShell lang={lang} lightHeader><Collection lang={lang} initialArea={typeof searchParams.area==='string'?searchParams.area:undefined} initialQuery={typeof searchParams.q==='string'?searchParams.q:''}/></SiteShell>}
