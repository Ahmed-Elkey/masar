import {liveCatalogue} from "@/lib/backend/catalogue";
import {NextRequest,NextResponse} from 'next/server';
import {PROJECTS} from '@/lib/data';
let active=0;
export async function POST(request:NextRequest){
 if(Number(request.headers.get('content-length')??0)>4096)return NextResponse.json({error:'Too large'},{status:413});
 let body;try{const raw=await request.text();if(raw.length>4096)throw new Error();body=JSON.parse(raw);}catch{return NextResponse.json({error:'Invalid request'},{status:400});}
 const to=body?.destination,ids=body?.projects;
 if(!to||!Number.isFinite(to.lat)||!Number.isFinite(to.lng)||to.lat<22||to.lat>32||to.lng<24||to.lng>37||!Array.isArray(ids)||ids.length<1||ids.length>6||new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'||!PROJECTS.some(p=>p.id===id)))return NextResponse.json({error:'Invalid coordinates or projects'},{status:400});
 if(active>=4)return NextResponse.json({error:'Busy, retry shortly'},{status:429,headers:{'Retry-After':'15'}});
 active++;
 try{const current=(await liveCatalogue()).projects;const results=[];for(let i=0;i<ids.length;i+=2){results.push(...await Promise.all(ids.slice(i,i+2).map(async(id:string)=>{const p=current.find(p=>p.id===id)!;try{const r=await fetch(`https://router.project-osrm.org/route/v1/driving/${p.lng},${p.lat};${to.lng},${to.lat}?overview=false&steps=false`,{cache:'no-store',signal:AbortSignal.any([request.signal,AbortSignal.timeout(12000)])});if(!r.ok)throw new Error();const data=await r.json(),route=data.routes?.[0];if(data.code!=='Ok'||!route||!Number.isFinite(route.distance)||!Number.isFinite(route.duration)||route.distance<0||route.duration<0)throw new Error();return {id,distance:route.distance,duration:route.duration};}catch{return {id,error:true};}})));if(request.signal.aborted)break;}return NextResponse.json({results},{headers:{'Cache-Control':'no-store'}});}finally{active--;}
}
