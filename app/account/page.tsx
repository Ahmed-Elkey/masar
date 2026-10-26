import SiteShell from '@/components/estate/SiteShell';
import Account from '@/components/account/Account';
import {language,c} from '@/lib/estate';
export async function generateMetadata({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;return {title:c(language(searchParams),'My Account — Nile Estates','حسابي — نايل إستيتس'),robots:{index:false,follow:false}};}
export default async function Page({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;const lang=language(searchParams);return <SiteShell lang={lang} lightHeader><Account lang={lang} authError={searchParams.error==='auth'}/></SiteShell>;}
