import SiteShell from '@/components/estate/SiteShell';
import Updates from '@/components/estate/Updates';
import {c,language} from '@/lib/estate';
export async function generateMetadata({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const lang=language(await searchParams);return {title:c(lang,'Project updates — Nile Estates','تحديثات المشاريع — نايل إستيتس'),description:c(lang,'Follow project information and asking-price changes, with dates and sources.','تابع تحديثات بيانات المشاريع والأسعار المعروضة بالتاريخ والوقت والمصدر.')};}
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const p=await searchParams,lang=language(p);return <SiteShell lang={lang} lightHeader><Updates lang={lang} initialProject={typeof p.project==='string'?p.project:undefined}/></SiteShell>;}
