import 'server-only';
import {renderOwnerMail} from './mailTemplate';
import nodemailer from 'nodemailer';
import {createHmac,createHash} from 'node:crypto';
import {PROJECTS} from '@/lib/data';
export function mailProvider(){return process.env.MAIL_PROVIDER??'gmail';}
export function gmailSettings(){
 const user=process.env.GMAIL_USER?.trim(),password=process.env.GMAIL_APP_PASSWORD?.replace(/\s/g,'');
 if(!user||!/^[-a-zA-Z0-9._+]+@gmail\.com$/i.test(user)||!password||!/^[a-zA-Z0-9]{16}$/.test(password))return null;
 return {user,password};
}
export function inboxConfigured(){
 const mail=mailProvider()==='gmail'?Boolean(gmailSettings()):mailProvider()==='resend'?Boolean(process.env.RESEND_API_KEY&&process.env.MAIL_FROM):false;
 return Boolean(mail&&process.env.MAIL_TO&&process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY&&process.env.TURNSTILE_SECRET_KEY&&process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY&&process.env.RATE_LIMIT_SALT&&process.env.NEXT_PUBLIC_SITE_URL);
}
export type MessageInput={kind:'enquiry';project:string|null;name:string;email:string;body:string;evidence:string;lang:'ar'|'en';token:string;id:string};
export function validateMessage(raw:unknown):MessageInput|null{
 if(!raw||typeof raw!=='object')return null;const r=raw as Record<string,unknown>;
 if(r.kind!=='enquiry'||!['ar','en'].includes(r.lang as string)||typeof r.id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(r.id)||typeof r.token!=='string'||r.token.length>4096||!r.token||r.website)return null;
 const name=typeof r.name==='string'?r.name.trim():'',email=typeof r.email==='string'?r.email.trim():'',body=typeof r.body==='string'?r.body.trim():'',evidence=typeof r.evidence==='string'?r.evidence.trim():'';
 if(name.length>100||body.length<10||body.length>4000||email.length>254||/[\r\n]/.test(email)||r.kind==='enquiry'&&(!name||!email)||email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return null;
 const project=typeof r.project==='string'&&r.project!=='any'?r.project:null;if(project&&!PROJECTS.some(p=>p.id===project))return null;
 if(evidence){try{const u=new URL(evidence);if(u.protocol!=='https:'||evidence.length>1000||u.username||u.password)return null;}catch{return null;}}
 return {kind:r.kind as MessageInput['kind'],name,email,body,evidence,project,lang:r.lang as MessageInput['lang'],token:r.token,id:r.id};
}
export function messageFingerprint(m:MessageInput){return createHash('sha256').update(JSON.stringify({kind:m.kind,project:m.project,name:m.name,email:m.email,body:m.body,evidence:m.evidence,lang:m.lang})).digest('hex');}
export function quotaKey(ip:string){return createHmac('sha256',process.env.RATE_LIMIT_SALT!).update(ip).digest('hex');}
export async function sendOwnerMail(m:MessageInput){
 const project=PROJECTS.find(p=>p.id===m.project);
 const projectName=project?.name[m.lang]??(m.lang==='ar'?'استفسار عام':'General enquiry');
 const {subject,text,html}=renderOwnerMail(m,{projectName,siteUrl:(process.env.NEXT_PUBLIC_SITE_URL??'').replace(/\/$/,'')});
 if(mailProvider()==='gmail'){
  const settings=gmailSettings(),to=process.env.MAIL_TO?.trim();
  if(!settings||!to||!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(to))throw new Error('Mail not configured');
  const transport=nodemailer.createTransport({host:'smtp.gmail.com',port:465,secure:true,
   auth:{user:settings.user,pass:settings.password},tls:{minVersion:'TLSv1.2'},
   connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,
   disableFileAccess:true,disableUrlAccess:true,logger:false,debug:false});
  try{const result=await transport.sendMail({from:{name:'Nile Estates',address:settings.user},to,
   ...(m.email?{replyTo:m.email}:{}),subject,text,html,messageId:`<nile-estates-${m.id}@gmail.com>`});
   if(!result.accepted?.some(address=>String(address).toLowerCase()===to.toLowerCase()))throw new Error('Mail not accepted');
   return result.messageId;
  }finally{transport.close();}
 }
 if(mailProvider()!=='resend')throw new Error('Unknown mail provider');
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':'website-message/'+m.id},body:JSON.stringify({from:process.env.MAIL_FROM,to:[process.env.MAIL_TO],...(m.email?{reply_to:m.email}:{}),subject,text,html}),signal:AbortSignal.timeout(15000),cache:'no-store'});if(!response.ok)throw new Error('Mail provider unavailable');const data=await response.json();if(typeof data.id!=='string')throw new Error('Invalid provider response');return data.id as string;}
