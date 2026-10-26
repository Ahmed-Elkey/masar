import type {Project} from './types';
export type CatalogueRecord={project_id:string;payload:Pick<Project,'name'|'developer'|'area'|'lat'|'lng'|'status'|'description'|'amenities'|'url'|'areaApprox'>;source_url:string;source_checked_at:string;valid_until:string};
export function validCatalogueRecord(value:unknown,base:readonly Project[],hosts:readonly string[],now=Date.now()):value is CatalogueRecord{
 if(!value||typeof value!=='object')return false;const v=value as CatalogueRecord,p=v.payload;
 if(!base.some(p=>p.id===v.project_id)||!p||!['underConstruction','ready','delivered'].includes(p.status)||!base.some(b=>b.developer===p.developer)||!Number.isFinite(p.lat)||!Number.isFinite(p.lng)||p.lat<22||p.lat>32||p.lng<24||p.lng>37||typeof p.areaApprox!=='boolean')return false;
 for(const field of ['name','area','description'] as const)for(const lang of ['en','ar'] as const)if(typeof p[field]?.[lang]!=='string'||!p[field][lang].trim()||p[field][lang].length>(field==='description'?4000:150))return false;
 for(const lang of ['en','ar'] as const)if(!Array.isArray(p.amenities?.[lang])||p.amenities[lang].length>30||p.amenities[lang].some(a=>typeof a!=='string'||a.length>200))return false;
 for(const link of [v.source_url,p.url]){try{const u=new URL(link!);if(u.protocol!=='https:'||u.username||u.password||!hosts.includes(u.hostname)||link!.length>2000)return false;}catch{return false;}}
 const checked=Date.parse(v.source_checked_at),expires=Date.parse(v.valid_until);return Number.isFinite(checked)&&Number.isFinite(expires)&&checked<=now&&expires>now&&expires>checked&&expires-checked<=30*86400000;
}
export function mergeCatalogue(base:readonly Project[],records:readonly CatalogueRecord[]){return base.map(project=>{const r=records.find(r=>r.project_id===project.id&&Date.parse(r.valid_until)>Date.now());if(!r)return project;const {name,developer,area,lat,lng,status,description,amenities,url,areaApprox}=r.payload;return {...project,name,developer,area,lat,lng,status,description,amenities,url,areaApprox};});}
