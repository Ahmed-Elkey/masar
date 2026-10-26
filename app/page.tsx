import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SiteShell from '@/components/estate/SiteShell';
import Home from '@/components/estate/Home';
import { language } from '@/lib/estate';
export async function generateMetadata({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}): Promise<Metadata>{const searchParams=await searchParamsPromise; return language(searchParams)==='ar' ? { title:'مَسَار — مكان يشبهك',description:'اكتشف مشاريع سكنية في أنحاء مصر، واستكشف المناطق والخدمات على خريطة تفاعلية.' } : { title: 'Masar — A Place to Call Home', description: 'Discover residential destinations across Egypt. Explore the collection, find your next address, and see every place in perspective.' }; }
export default async function Page({searchParams: searchParamsPromise}:{searchParams: Promise<Record<string,string|string[]|undefined>>}){const searchParams=await searchParamsPromise;
 if(searchParams.project||searchParams.poi||searchParams.landmark||searchParams.theme){const q=new URLSearchParams();Object.entries(searchParams).forEach(([k,v])=>{if(typeof v==='string')q.set(k,v)});redirect(`/map?${q}`);}
 const lang=language(searchParams); return <SiteShell lang={lang}><Home lang={lang}/></SiteShell>;
}
