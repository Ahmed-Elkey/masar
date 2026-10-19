import type { Metadata } from 'next';
import SiteShell from '@/components/estate/SiteShell';
import Collection from '@/components/estate/Collection';
import { c, language } from '@/lib/estate';
export function generateMetadata({searchParams}:{searchParams:Record<string,string|string[]|undefined>}):Metadata{const lang=language(searchParams);return {title:c(lang,'The Collection — Nile Estates','المشاريع — نايل إستيتس'),description:c(lang,'Explore 23 residential projects across Egypt.','٢٣ مشروعًا سكنيًا في أنحاء مصر — استكشفها من غير ما تسيب مكانك.')};}
export default function Page({searchParams}:{searchParams:Record<string,string|string[]|undefined>}){const lang=language(searchParams);return <SiteShell lang={lang} lightHeader><Collection lang={lang} initialArea={typeof searchParams.area==='string'?searchParams.area:undefined} initialQuery={typeof searchParams.q==='string'?searchParams.q:''}/></SiteShell>}
