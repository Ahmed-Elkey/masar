import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import ts from 'typescript';
const moduleFrom=async path=>{const source=await fs.readFile(path,'utf8');const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const exports={};new Function('exports',output)(exports);return exports;};
const {validateOffer}=await moduleFrom('lib/priceOffers.ts');
const {validCatalogueRecord,mergeCatalogue}=await moduleFrom('lib/liveCatalogue.ts');
const now=Date.now(),checked=new Date(now-1000).toISOString(),expires=new Date(now+3600000).toISOString();
const offer={project_id:'test',amount:100,currency:'EGP',unit_type_en:'Apartment',unit_type_ar:'شقة',note_en:'',note_ar:'',source_url:'https://source.example/offer',source_checked_at:checked,valid_until:expires};
assert(validateOffer(offer,['test'],['source.example'],now));
for(const bad of [{amount:-1},{source_url:'https://source.example.evil.test/'},{valid_until:checked},{source_checked_at:new Date(now+100000).toISOString()},{currency:'USD'}])assert(!validateOffer({...offer,...bad},['test'],['source.example'],now));
const base={id:'test',name:{en:'Test',ar:'تجربة'},developer:'Known',area:{en:'Cairo',ar:'القاهرة'},lat:30,lng:31,status:'ready',description:{en:'Description',ar:'وصف'},amenities:{en:[],ar:[]},url:'https://source.example/project',areaApprox:false,dx:0,dy:0};
const record={project_id:'test',payload:{...base,id:'injected'},source_url:'https://source.example/project',source_checked_at:checked,valid_until:expires};
assert(validCatalogueRecord(record,[base],['source.example'],now));assert.equal(mergeCatalogue([base],[record])[0].id,'test');assert(!validCatalogueRecord({...record,payload:{...base,lat:0}},[base],['source.example'],now));assert.equal(mergeCatalogue([base],[{...record,valid_until:checked}])[0],base);
const db=new PGlite();
await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema public,auth to anon,authenticated,service_role;grant execute on function auth.uid() to anon,authenticated;`);
await db.exec(await fs.readFile('supabase/migrations/202610200001_services.sql','utf8'));
await db.exec(await fs.readFile('supabase/migrations/202610200002_gmail_delivery_claim.sql','utf8'));
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
await db.query('insert into auth.users values ($1),($2)',[a,b]);
await db.exec(`set role authenticated;set request.jwt.claim.sub='${a}';`);
let row=await db.query("select save_shortlist(array['test'],array['test'],0) as result");assert.equal(row.rows[0].result.ok,true);
row=await db.query("select save_shortlist(array['other'],array[]::text[],0) as result");assert.equal(row.rows[0].result.ok,false);
row=await db.query("select save_shortlist(array['test'],array[]::text[],1) as result");assert.equal(row.rows[0].result.version,2);
row=await db.query("select save_shortlist(array['stale'],array[]::text[],1) as result");assert.equal(row.rows[0].result.ok,false);
await db.exec(`set request.jwt.claim.sub='${b}';`);assert.equal((await db.query('select * from shortlists')).rows.length,0);
await assert.rejects(db.query('insert into shortlists(user_id) values($1)',[a]));await assert.rejects(db.query('select * from messages'));
await db.exec('reset role;set role service_role;');
for(let i=0;i<6;i++){row=await db.query("select consume_submission_quota('ip',5,3600) as allowed");assert.equal(row.rows[0].allowed,i<5);}
await db.query('select apply_catalogue_feed($1::jsonb,$2::jsonb)',[JSON.stringify([record]),JSON.stringify([offer])]);
const invalid={...offer,project_id:'bad',amount:-5};await assert.rejects(db.query('select apply_catalogue_feed($1::jsonb,$2::jsonb)',[JSON.stringify([{...record,project_id:'rollback'}]),JSON.stringify([invalid])]));assert.equal((await db.query("select * from project_records where project_id='rollback'")).rows.length,0);
await db.query("insert into messages(id,fingerprint,kind,name,email,body,lang) values($1,'test','enquiry','Test','visitor@example.test','Test body','en')",[a]);
for(let attempt=0;attempt<2;attempt++){const claim=await db.query('update messages set notification_attempted_at=now() where id=$1 and notification_attempted_at is null returning id',[a]);assert.equal(claim.rows.length,attempt===0?1:0);}
await db.exec('reset role;set role anon;');assert.equal((await db.query('select * from price_offers')).rows.length,1);await assert.rejects(db.query("update price_offers set amount=1"));await assert.rejects(db.query('select * from shortlists'));await assert.rejects(db.query('select * from messages'));await assert.rejects(db.query("select consume_submission_quota('hacker',100,3600)"));await assert.rejects(db.query("select apply_catalogue_feed('[]','[]')"));
await db.exec('reset role;');await db.query("update price_offers set valid_until=now()-interval '1 second',source_checked_at=now()-interval '2 seconds'");await db.exec('set role anon;');assert.equal((await db.query('select * from price_offers')).rows.length,0);
await db.close();console.log('Service checks passed: source validation, expiry, protected identity, SQL migration, owner isolation, version conflicts, quota, atomic feed rollback and public RLS.');
// Mock only the provider transport; never send an external email in tests.
const {createRequire}=await import('node:module');const require=createRequire(import.meta.url);
const mailTemplate=await moduleFrom('lib/backend/mailTemplate.ts');
const source=await fs.readFile('lib/backend/messaging.ts','utf8'),exports={};
new Function('exports','require',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(exports,id=>id==='server-only'?{}:id==='./mailTemplate'?mailTemplate:id==='@/lib/data'?{PROJECTS:[base]}:require(id));
const message={id:'33333333-3333-4333-8333-333333333333',kind:'enquiry',project:'test',name:'Test',email:'visitor@example.test',body:'A test enquiry body.',evidence:'',lang:'en',token:'test-challenge'};
assert(exports.validateMessage(message));for(const bad of [{email:'bad\r\nBcc: victim@test'},{project:'unknown'},{body:'short'},{website:'bot'},{token:''},{kind:'correction'}])assert.equal(exports.validateMessage({...message,...bad}),null);
assert.equal(exports.messageFingerprint(message),exports.messageFingerprint({...message,token:'different'}));
const originalFetch=globalThis.fetch;process.env.MAIL_PROVIDER='resend';process.env.RESEND_API_KEY='test-key';process.env.MAIL_TO='owner@example.test';process.env.MAIL_FROM='Website <site@example.test>';
try{globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');const body=JSON.parse(options.body);assert.deepEqual(body.to,['owner@example.test']);assert.equal(body.reply_to,'visitor@example.test');assert.equal(options.headers['Idempotency-Key'],'website-message/'+message.id);return new Response(JSON.stringify({id:'mock-provider-id'}));};assert.equal(await exports.sendOwnerMail(message),'mock-provider-id');globalThis.fetch=async()=>new Response('{}',{status:503});await assert.rejects(exports.sendOwnerMail(message));}finally{globalThis.fetch=originalFetch;}
console.log('Message checks passed: payload validation, stable retry fingerprint, fixed inbox, reply-to, idempotency and provider failure handling (mock transport).');

// Gmail transport is stubbed: no network connection and no real credentials.
const smtpExports={};let smtpOptions,smtpMessage,closed=0,smtpMode='accepted';
const smtpMock={createTransport(options){smtpOptions=options;return {async sendMail(message){smtpMessage=message;if(smtpMode==='failure')throw new Error('Mock SMTP failure');return {messageId:'smtp-test-id',accepted:smtpMode==='accepted'?['owner@example.test']:[],rejected:smtpMode==='rejected'?['owner@example.test']:[]};},close(){closed++;}};}};
new Function('exports','require',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText)(smtpExports,id=>id==='server-only'?{}:id==='./mailTemplate'?mailTemplate:id==='nodemailer'?smtpMock:id==='@/lib/data'?{PROJECTS:[base]}:require(id));
process.env.MAIL_PROVIDER='gmail';delete process.env.RESEND_API_KEY;process.env.GMAIL_USER='project.sender@gmail.com';process.env.GMAIL_APP_PASSWORD='abcd efgh ijkl mnop';
assert.deepEqual(smtpExports.gmailSettings(),{user:'project.sender@gmail.com',password:'abcdefghijklmnop'});
assert.equal(await smtpExports.sendOwnerMail(message),'smtp-test-id');assert.equal(smtpOptions.host,'smtp.gmail.com');assert.equal(smtpOptions.port,465);assert.equal(smtpOptions.secure,true);assert.equal(smtpOptions.tls.minVersion,'TLSv1.2');assert.equal(smtpOptions.disableFileAccess,true);assert.equal(smtpOptions.disableUrlAccess,true);assert.equal(smtpMessage.from.address,'project.sender@gmail.com');assert.equal(smtpMessage.replyTo,'visitor@example.test');assert.equal(smtpMessage.to,'owner@example.test');assert.equal(closed,1);
smtpMode='rejected';await assert.rejects(smtpExports.sendOwnerMail(message));assert.equal(closed,2);smtpMode='failure';await assert.rejects(smtpExports.sendOwnerMail(message));assert.equal(closed,3);
process.env.GMAIL_APP_PASSWORD='';assert.equal(smtpExports.gmailSettings(),null);await assert.rejects(smtpExports.sendOwnerMail(message));process.env.MAIL_PROVIDER='unknown';await assert.rejects(smtpExports.sendOwnerMail(message));
console.log('Gmail checks passed: TLS SMTP settings, fixed sender/inbox, app-password normalization, rejected recipient, cleanup, missing config and one-time SQL notification claim. No real email sent.');

const template=mailTemplate.renderOwnerMail({...message,lang:'ar',body:'<script>alert(1)</script>\nSecond line',name:'<img src=x onerror=bad>'},{projectName:'ميفيدا',siteUrl:'https://estate.example'});assert(template.html.includes('dir="rtl"'));assert(template.html.includes('&lt;script&gt;'));assert(!template.html.includes('<script>'));assert(template.html.includes('&lt;img'));assert(template.html.includes('<br>Second line'));assert(template.text.includes('<script>'));assert(template.html.includes('https://estate.example/projects/test?lang=ar'));const unsafe=mailTemplate.renderOwnerMail({...message,evidence:'javascript:alert(1)'},{projectName:'Test',siteUrl:'javascript:bad'});assert(!unsafe.html.includes('href="javascript:'));console.log('Email template checks passed: bilingual direction, HTML escaping, plain-text fallback and safe links.');
