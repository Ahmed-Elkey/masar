import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
try{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select null::uuid$$;grant usage on schema public,auth to anon,authenticated,service_role;`);
 await db.exec(await fs.readFile('supabase/migrations/202610200001_services.sql','utf8'));
 await db.exec(await fs.readFile('supabase/migrations/202610210003_project_updates.sql','utf8'));
 await db.exec('set role service_role');
 const checked=new Date(Date.now()-1000).toISOString(),expires=new Date(Date.now()+86400000).toISOString();
 const record={project_id:'test',payload:{name:{ar:'اختبار',en:'Test'},status:'ready',lat:30,lng:31},source_url:'https://source.example/project',source_checked_at:checked,valid_until:expires};
 const offer={project_id:'test',amount:100,currency:'EGP',unit_type_en:'Apartment',unit_type_ar:'شقة',note_en:'',note_ar:'',source_url:'https://source.example/offer',source_checked_at:checked,valid_until:expires};
 const feed=(records,offers)=>db.query('select apply_catalogue_feed($1::jsonb,$2::jsonb)',[JSON.stringify(records),JSON.stringify(offers)]);
 const rows=async()=> (await db.query('select * from project_updates order by id')).rows;
 await feed([record],[offer]);assert.deepEqual((await rows()).map(r=>r.kind),['project_added','price_added']);
 await feed([{...record,valid_until:new Date(Date.now()+2*86400000).toISOString()}],[offer]);assert.equal((await rows()).length,2,'Freshness-only checks must not fabricate changes');
 await feed([{...record,payload:{...record.payload,status:'delivered'}}],[{...offer,amount:150}]);
 let history=await rows();assert.equal(history.length,4);assert.deepEqual(history[2].changed_fields,['status']);assert.equal(Number(history[3].previous_amount),100);assert.equal(Number(history[3].current_amount),150);
 await assert.rejects(feed([{...record,project_id:'rollback'}],[{...offer,project_id:'invalid',amount:-1}]));assert.equal((await rows()).length,4,'Audit events must roll back with a failed feed');
 await db.exec("delete from price_offers where project_id='test';delete from project_records where project_id='test'");history=await rows();assert.deepEqual(history.slice(-2).map(r=>r.kind),['price_removed','project_removed']);assert.equal(Number(history[4].previous_amount),150);assert.equal(history[4].current_amount,null);
 await db.exec('reset role;set role anon');assert.equal((await rows()).length,6);
 await assert.rejects(db.exec("insert into project_updates(project_id,kind) values('fake','price_added')"));await assert.rejects(db.exec("delete from project_updates"));await assert.rejects(db.exec('select record_price_update()'));
 console.log('Update history checks passed: real additions/changes/removals, before/after prices, no-op suppression, transactional rollback, public read and protected writes.');
}finally{await db.close();}
