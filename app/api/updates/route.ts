import {NextRequest,NextResponse} from 'next/server';
import {publicBackend} from '@/lib/backend/server';
import {PROJECTS} from '@/lib/data';
import {UPDATE_COLUMNS} from '@/lib/projectUpdates';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
 const p=request.nextUrl.searchParams,type=p.get('type')??'all',days=p.get('days')??'all',project=p.get('project'),before=p.get('before');
 if(!['all','project','price'].includes(type)||!['all','7','30'].includes(days)||project&&!PROJECTS.some(v=>v.id===project)||before&&!/^[1-9]\d{0,14}$/.test(before))return NextResponse.json({error:'invalid'},{status:400});
 const db=publicBackend();if(!db)return NextResponse.json({updates:[],connected:false,next:null},{headers:{'Cache-Control':'no-store'}});
 let query=db.from('project_updates').select(UPDATE_COLUMNS).in('project_id',PROJECTS.map(p=>p.id)).order('id',{ascending:false}).limit(51);
 if(type==='project')query=query.in('kind',['project_added','project_updated','project_removed']);
 if(type==='price')query=query.in('kind',['price_added','price_updated','price_removed']);
 if(project)query=query.eq('project_id',project);if(before)query=query.lt('id',before);
 if(days!=='all')query=query.gte('created_at',new Date(Date.now()-Number(days)*86400000).toISOString());
 const {data,error}=await query;if(error)return NextResponse.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});
 return NextResponse.json({updates:data.slice(0,50),connected:true,next:data.length>50?String(data[49].id):null},{headers:{'Cache-Control':'no-store'}});
}
