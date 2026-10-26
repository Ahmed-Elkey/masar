export type CatalogueUpdate={status:'underConstruction'|'ready'|'delivered';url:string;lat:number;lng:number;verifiedAt:string|null;note:{en:string;ar:string}};
export function validUpdate(value:unknown):value is CatalogueUpdate {
 if(!value||typeof value!=='object')return false;const v=value as CatalogueUpdate;
 if(!['underConstruction','ready','delivered'].includes(v.status)||!Number.isFinite(v.lat)||!Number.isFinite(v.lng)||v.lat<22||v.lat>32||v.lng<24||v.lng>37)return false;
 try{const u=new URL(v.url);if(u.protocol!=='https:'||u.username||u.password)return false;}catch{return false;}
 if(v.verifiedAt!==null&&(!/^\d{4}-\d{2}-\d{2}$/.test(v.verifiedAt)||!Number.isFinite(Date.parse(v.verifiedAt))||new Date(v.verifiedAt).toISOString().slice(0,10)!==v.verifiedAt||v.verifiedAt>new Date().toISOString().slice(0,10)))return false;
 return !!v.note&&typeof v.note.en==='string'&&typeof v.note.ar==='string'&&v.note.en.length<=1000&&v.note.ar.length<=1000;
}
