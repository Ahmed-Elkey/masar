"use client";
import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import SiteShell,{EditorialLink,c,siteHref} from "@/components/estate/SiteShell";
function MissingPage(){
 const params=useSearchParams(),lang=params.get("lang")==="ar"?"ar":"en";
 return <SiteShell lang={lang} lightHeader><section className="collection-intro"><span className="eyebrow">{c(lang,"404 · This address is not on the map","٤٠٤ · العنوان ده مش على الخريطة")}</span><h1 className="display">{c(lang,"Lost","تايه؟")}<em>{c(lang,"in the city","نرجع للطريق")}</em></h1><p>{c(lang,"The page you were looking for does not exist. Explore our projects or return to the map.","الصفحة اللي بتدور عليها مش موجودة. استكشف المشاريع أو ارجع للخريطة.")}</p><div className="not-found-links">{[["/projects","View the collection","استكشف المشاريع"],["/map","Explore the map","استكشف الخريطة"],["/","Back home","العودة للرئيسية"]].map(([path,en,ar])=><EditorialLink key={path} href={siteHref(path,lang)}>{c(lang,en,ar)}</EditorialLink>)}</div></section></SiteShell>;
}
export default function NotFound(){return <Suspense fallback={null}><MissingPage/></Suspense>}
