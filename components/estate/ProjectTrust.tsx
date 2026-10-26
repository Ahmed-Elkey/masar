"use client";
import {useCatalogueRecords} from "./CatalogueProvider";
import Link from 'next/link';
import updates from '@/lib/catalogueUpdates.json';
import type {CatalogueUpdate} from '@/lib/catalogueValidation';
import type {Lang,Project} from '@/lib/types';
import {CATALOGUE_VERSION,CATALOGUE_NOTE,projectSources} from '@/lib/catalogue';
import {c,siteHref} from '@/lib/estate';
export default function ProjectTrust({project,lang}:{project:Project;lang:Lang}){
 const record=useCatalogueRecords().find(r=>r.project_id===project.id&&Date.parse(r.valid_until)>Date.now());
 const sources=projectSources(project.id),update=(updates as Record<string,CatalogueUpdate>)[project.id];
 return <section className="project-trust"><h2>{c(lang,'Know your sources','اعرف مصدر المعلومة')}</h2><p>{c(lang,'Catalogue edition','إصدار الدليل')}: <time dateTime={CATALOGUE_VERSION}>{new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{dateStyle:'long'}).format(new Date(CATALOGUE_VERSION+'T12:00:00Z'))}</time>. {CATALOGUE_NOTE[lang]}</p><dl><div><dt>{c(lang,'Source verification date','تاريخ مراجعة المصدر')}</dt><dd>{record?.source_checked_at ?? update?.verifiedAt ?? c(lang,'Not recorded — check the source directly.','غير مسجل — راجع المصدر مباشرة.')}</dd></div><div><dt>{c(lang,'Map position','موقع الخريطة')}</dt><dd>{c(lang,project.areaApprox?'Approximate area centre':'Project marker; confirm the entrance before visiting',project.areaApprox?'مركز تقريبي للمنطقة':'علامة للمشروع؛ تأكد من المدخل قبل الزيارة')}</dd></div><div><dt>{c(lang,'Prices and available units','الأسعار والوحدات المتاحة')}</dt><dd>{c(lang,'Not a live inventory. Request current details from the developer.','مش مخزون مباشر. اطلب التفاصيل الحالية من المطور.')}</dd></div></dl>{update?.note[lang]&&<p>{update.note[lang]}</p>}<div className="product-links">{sources.project&&<a href={record?.source_url??project.url??sources.project} target="_blank" rel="noreferrer">{c(lang,'Project source','مصدر المشروع')} ↗</a>}{sources.listing&&<a href={sources.listing} target="_blank" rel="noreferrer">{c(lang,'Listing source','مصدر البيانات')} ↗</a>}<Link href={siteHref('/updates?project='+project.id,lang)}>{c(lang,'Project updates','تحديثات المشروع')} ↗</Link><Link href={siteHref('/data?project='+project.id,lang)}>{c(lang,'Sources & privacy','المصادر والخصوصية')} ↗</Link></div></section>;
}
