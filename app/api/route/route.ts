import { NextRequest,NextResponse } from 'next/server';
import { LANDMARKS,PROJECTS } from '@/lib/data';
import { POIS } from '@/lib/poi';
import type { DrivingRoute } from '@/lib/routing';
const cache = new Map<string,DrivingRoute>();
const pending = new Map<string,Promise<DrivingRoute>>();
async function getRoute(from:{lng:number;lat:number},to:{lng:number;lat:number}) {
  const coordinates=`${from.lng},${from.lat};${to.lng},${to.lat}`;
  const response=await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`,{signal:AbortSignal.timeout(15000),next:{revalidate:86400}});
  if(!response.ok)throw new Error('Routing provider unavailable');
  const result=await response.json(),route=result.routes?.[0];
  if(result.code!=='Ok'||!route||!Number.isFinite(route.distance)||!Number.isFinite(route.duration)||route.geometry?.type!=='LineString'||route.geometry.coordinates.length<2||route.distance<0||route.duration<0||!route.geometry.coordinates.every((p:unknown)=>Array.isArray(p)&&p.length>=2&&p.every(Number.isFinite)))throw new Error('No driving route');
  return {distance:route.distance,duration:route.duration,geometry:route.geometry} as DrivingRoute;
}
export async function GET(request:NextRequest) {
  const params=request.nextUrl.searchParams,project=PROJECTS.find(p=>p.id===params.get('project')),destination=params.get('destination');
  const place=destination?.startsWith('landmark:')?LANDMARKS.find(p=>`landmark:${p.id}`===destination):POIS.find(p=>p.id===destination);
  // Only curated public locations are accepted; no arbitrary URLs or coordinates.
  if(!project||!place)return NextResponse.json({error:'Unknown project or destination'},{status:400});
  const key=`${project.id}:${destination}`;
  try {
    let route=cache.get(key);
    if(!route){let task=pending.get(key);if(!task){task=getRoute(project,place);pending.set(key,task);}try{route=await task;cache.set(key,route);}finally{pending.delete(key);}}
    return NextResponse.json(route,{headers:{'Cache-Control':'public, max-age=3600, stale-while-revalidate=86400'}});
  }catch{return NextResponse.json({error:'Driving route temporarily unavailable'},{status:503});}
}
