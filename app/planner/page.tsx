import SiteShell from '@/components/estate/SiteShell';
import Planner from '@/components/estate/Planner';
import {language,c} from '@/lib/estate';
export async function generateMetadata({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;return {title:c(language(searchParams),'My Planner — Masar','اختياراتي — مَسَار'),robots:{index:false,follow:true}};}
export default async function Page({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;const lang=language(searchParams);const ids=(key:string)=>typeof searchParams[key]==='string'?(searchParams[key] as string).slice(0,2000).split(','):[];return <SiteShell lang={lang} lightHeader><Planner lang={lang} sharedSaved={ids('saved')} sharedCompare={ids('compare')}/></SiteShell>;}
