import {NextRequest,NextResponse} from 'next/server';
import {adminBackend} from '@/lib/backend/server';
import {sameOrigin,smallJson} from '@/lib/backend/request';
import {inboxConfigured,validateMessage,messageFingerprint,quotaKey,sendOwnerMail,mailProvider} from '@/lib/backend/messaging';
export const runtime='nodejs';
export const maxDuration=60;
const reply=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:NextRequest){
 if(!sameOrigin(request))return reply({error:'origin'},403);if(!inboxConfigured())return reply({error:'not_configured'},503);
 let raw;try{raw=await smallJson(request);}catch{return reply({error:'invalid'},400);}const message=validateMessage(raw);if(!message)return reply({error:'invalid'},400);
 const db=adminBackend()!,fingerprint=messageFingerprint(message);
 // Check duplicate IDs before spending a one-use challenge. No data is returned for mismatched content.
 const existing=await db.from('messages').select('fingerprint,delivery_status,created_at').eq('id',message.id).maybeSingle();
 if(existing.error)return reply({error:'storage_unavailable'},503);
 if(existing.data){if(existing.data.fingerprint!==fingerprint)return reply({error:'conflict'},409);if(existing.data.delivery_status==='accepted')return reply({id:message.id,status:'accepted'});if(Date.now()-Date.parse(existing.data.created_at)>23*3600000)return reply({id:message.id,status:'stored'},202);}
  const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()??'unknown';
  const limits:[string,number,number][]=[[quotaKey(ip),5,3600],['global-message-limit',100,3600]];if(mailProvider()==='gmail')limits.push(['gmail-daily-message-limit',100,86400]);
  for(const [key,limit,window] of limits){const {data,error}=await db.rpc('consume_submission_quota',{p_key:key,p_limit:limit,p_window_seconds:window});if(error)return reply({error:'storage_unavailable'},503);if(!data)return reply({error:'rate_limited'},429);}
 if(!existing.data){
  let challenge;try{const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:message.token}),cache:'no-store',signal:AbortSignal.timeout(10000)});challenge=await r.json();}catch{return reply({error:'verification_unavailable'},503);}
  if(!challenge.success||challenge.hostname!==new URL(process.env.NEXT_PUBLIC_SITE_URL!).hostname)return reply({error:'verification'},400);
  const {error}=await db.from('messages').insert({id:message.id,fingerprint,kind:message.kind,project_id:message.project,name:message.name,email:message.email,body:message.body,evidence:message.evidence,lang:message.lang});if(error){if(error.code!=='23505')return reply({error:'storage_unavailable'},503);return reply({error:'retry'},409);}
 }
 // SMTP has no provider idempotency key. Claim once atomically; ambiguous
 // delivery failures remain stored for owner review rather than risking duplicates.
 if(mailProvider()==='gmail'){
  const {data,error}=await db.from('messages').update({notification_attempted_at:new Date().toISOString()}).eq('id',message.id).is('notification_attempted_at',null).select('id');
  if(error||!data?.length)return reply({id:message.id,status:'stored'},202);
 }
 try{const providerId=await sendOwnerMail(message);const {error}=await db.from('messages').update({delivery_status:'accepted',provider_id:providerId}).eq('id',message.id);if(error)return reply({id:message.id,status:'stored'},202);return reply({id:message.id,status:'accepted'});}catch{await db.from('messages').update({delivery_status:'failed'}).eq('id',message.id);return reply({id:message.id,status:'stored'},202);}
}
