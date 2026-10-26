export type PriceOffer={project_id:string;amount:number;currency:'EGP';unit_type_en:string;unit_type_ar:string;note_en:string;note_ar:string;source_url:string;source_checked_at:string;valid_until:string};
export function validateOffer(value:unknown,ids:readonly string[],hosts:readonly string[],now=Date.now()):value is PriceOffer{
 if(!value||typeof value!=='object')return false;const v=value as PriceOffer;
 if(!ids.includes(v.project_id)||!Number.isFinite(v.amount)||v.amount<=0||v.amount>1e12||v.currency!=='EGP')return false;
 for(const key of ['unit_type_en','unit_type_ar','note_en','note_ar'] as const)if(typeof v[key]!=='string'||v[key].length>(key.startsWith('unit')?100:1000))return false;
 if(!v.unit_type_en.trim()||!v.unit_type_ar.trim())return false;
 try{const u=new URL(v.source_url);if(u.protocol!=='https:'||u.username||u.password||!hosts.includes(u.hostname)||v.source_url.length>2000)return false;}catch{return false;}
 const checked=Date.parse(v.source_checked_at),expires=Date.parse(v.valid_until);
 return Number.isFinite(checked)&&Number.isFinite(expires)&&checked<=now&&expires>now&&expires>checked&&expires-checked<=7*86400000;
}
