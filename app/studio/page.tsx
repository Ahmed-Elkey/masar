import SiteShell from '@/components/estate/SiteShell';
import CatalogueStudio from '@/components/estate/CatalogueStudio';
import {language,c} from '@/lib/estate';
export async function generateMetadata({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;return {title:c(language(searchParams),'Catalogue Workspace — Masar','صيانة الدليل — مَسَار'),robots:{index:false,follow:false}};}
export default async function Page({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;const lang=language(searchParams);return <SiteShell lang={lang} lightHeader><CatalogueStudio lang={lang}/></SiteShell>;}
