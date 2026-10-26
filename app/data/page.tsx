import SiteShell from '@/components/estate/SiteShell';
import DataGuide from '@/components/estate/DataGuide';
import {language,c} from '@/lib/estate';
export async function generateMetadata({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;return {title:c(language(searchParams),'Sources & Privacy — Masar','المصادر والخصوصية — مَسَار')};}
export default async function Page({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;const lang=language(searchParams);return <SiteShell lang={lang} lightHeader><DataGuide lang={lang} initialProject={typeof searchParams.project==='string'?searchParams.project:undefined}/></SiteShell>;}
