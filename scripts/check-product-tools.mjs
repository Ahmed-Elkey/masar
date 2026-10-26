import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import {validateFile} from './apply-catalogue-update.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const compile=async name=>{const code=ts.transpileModule(fs.readFileSync(path.join(root,name),'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));};
const {sanitizeSelection}=await compile('lib/selection.ts');
const ids=['mivida','fouka-bay','ivoire-west','il-bosco'];
assert.deepEqual(sanitizeSelection({saved:['mivida','bad','mivida',null,42],compare:ids},ids),{saved:['mivida'],compare:ids.slice(0,3)});
assert.deepEqual(sanitizeSelection(null,ids),{saved:[],compare:[]});
assert.deepEqual(sanitizeSelection({saved:'mivida',compare:{}},ids),{saved:[],compare:[]});
// Exercise persistent and quota-blocked storage without a browser or a real user profile.
const storageCode=ts.transpileModule(fs.readFileSync(path.join(root,'lib/shortlist.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const bucket=new Map();let quotaBlocked=false;
const fakeStorage={getItem:key=>bucket.get(key)??null,setItem:(key,value)=>{if(quotaBlocked)throw new Error('Quota');bucket.set(key,value);}};
const moduleState={exports:{}};
new Function('require','module','exports','localStorage',storageCode)(name=>name==='react'?{useSyncExternalStore:(_subscribe,snapshot)=>snapshot()}:name==='./data'?{PROJECTS:ids.map(id=>({id}))}:name==='./selection'?{sanitizeSelection}:(()=>{throw new Error('Unexpected import '+name)})(),moduleState,moduleState.exports,fakeStorage);
const store=moduleState.exports;
store.updateShortlist({saved:['mivida'],compare:ids.slice(0,3)});
assert.deepEqual(JSON.parse(bucket.get(store.SHORTLIST_KEY)).saved,['mivida']);
assert.equal(store.useShortlist().toggle('il-bosco','compare'),false);
quotaBlocked=true;store.updateShortlist({saved:['fouka-bay'],compare:[]});
assert.deepEqual(store.useShortlist().saved,['fouka-bay']);
assert.equal(store.useShortlist().storageError,true);
quotaBlocked=false;store.updateShortlist({saved:['ivoire-west'],compare:[]});
assert.deepEqual(store.useShortlist().saved,['ivoire-west']);
assert.equal(store.useShortlist().storageError,false);
const valid={status:'ready',url:'https://www.emaarmisr.com/',lat:30,lng:31,verifiedAt:null,note:{en:'Source checked',ar:'تمت مراجعة المصدر'}};
assert.equal(validateFile({version:1,updates:{mivida:valid}}).mivida.lat,30);
for(const patch of [{url:'javascript:alert(1)'},{lat:NaN},{lng:200},{verifiedAt:'2999-01-01'},{verifiedAt:'2026-02-30'},{status:'sold'},{note:{en:'x'}}])assert.throws(()=>validateFile({version:1,updates:{mivida:{...valid,...patch}}}));
assert.throws(()=>validateFile({version:1,updates:{unknown:valid}}));
assert.throws(()=>validateFile({version:1,updates:{}}));
const base=process.env.TEST_BASE_URL??'http://127.0.0.1:3001';
for(const body of [{},{destination:{lat:90,lng:31},projects:['mivida']},{destination:{lat:30,lng:31},projects:['bad']},{destination:{lat:30,lng:31},projects:['mivida','mivida']},{destination:{lat:'30',lng:31},projects:['mivida']}]){const r=await fetch(base+'/api/commute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(r.status,400);}
const oversized=await fetch(base+'/api/commute',{method:'POST',body:' '.repeat(5000)});assert.equal(oversized.status,413);
for(const lang of ['ar','en'])for(const route of ['/planner','/data','/studio','/projects','/projects/mivida']){const response=await fetch(base+route+'?lang='+lang);assert.equal(response.status,200,route);const body=await response.text();assert(!body.includes('Application error:'))}
const r=await fetch(base+'/api/commute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destination:{lat:30.0459,lng:31.2243},projects:['mivida']})});assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');const result=await r.json();assert.equal(result.results.length,1);assert.equal(result.results[0].id,'mivida');if(!result.results[0].error){assert(result.results[0].duration>=0);assert(result.results[0].distance>=0)}
console.log('Passed shortlist sanitization/cap, invalid maintenance updates, API input/size checks, bilingual pages and route response contract. Route provider: '+(result.results[0].error?'unavailable (explicit failure returned)':'live estimate received'));
