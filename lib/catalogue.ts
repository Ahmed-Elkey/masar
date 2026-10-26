import {PROJECTS} from './data';
import media from './media.json';
export const CATALOGUE_VERSION='2026-10-20';
export const CATALOGUE_NOTE={en:'Catalogue edition date; not a guarantee that developer information was verified on this date.',ar:'تاريخ إصدار الدليل، مش تأكيد إن معلومات المطور اتراجعت في نفس اليوم.'};
export function projectSources(id:string){const p=PROJECTS.find(p=>p.id===id);const m=(media as Record<string,{page?:string;brochureSource?:string;images:{source:string}[]}>)[id];return {project:p?.url,listing:m?.page,document:m?.brochureSource,images:[...new Set(m?.images.map(i=>i.source)??[])]};}
