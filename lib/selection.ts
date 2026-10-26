export type Shortlist={saved:string[];compare:string[]};
export function sanitizeSelection(value:unknown,allowed:readonly string[]):Shortlist{
 const clean=(items:unknown,max:number)=>Array.isArray(items)?[...new Set(items.filter((id):id is string=>typeof id==='string'&&allowed.includes(id)))].slice(0,max):[];
 const v=value as Partial<Shortlist>|null;return {saved:clean(v?.saved,allowed.length),compare:clean(v?.compare,3)};
}
