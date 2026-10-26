import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// Run the same trusted, repository-owned validator used by the editor/build.
const validator=fs.readFileSync(path.join(root,'lib/catalogueValidation.ts'),'utf8');
const code=ts.transpileModule(validator,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const {validUpdate}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
export function validateFile(input){
 if(!input||input.version!==1||!input.updates||typeof input.updates!=='object'||Array.isArray(input.updates))throw new Error('Invalid update format');
 const data=fs.readFileSync(path.join(root,'lib/data.ts'),'utf8'),ids=[...data.matchAll(/^    id: "([^"]+)"/gm)].map(m=>m[1]);
 const entries=Object.entries(input.updates);if(!entries.length||entries.length>ids.length)throw new Error('Empty or oversized update');
 for(const [id,v] of entries){if(!ids.includes(id)||!validUpdate(v))throw new Error('Invalid project update: '+id);}
 return Object.fromEntries(entries.map(([id,v])=>[id,{status:v.status,url:v.url,lat:v.lat,lng:v.lng,verifiedAt:v.verifiedAt,note:{en:v.note.en,ar:v.note.ar}}]));
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{const file=process.argv[2],mode=process.argv[3];if(!file||!['--check','--apply'].includes(mode))throw new Error('Usage: node scripts/apply-catalogue-update.mjs FILE --check|--apply');const raw=fs.readFileSync(file,'utf8');if(raw.length>100000)throw new Error('File too large');const updates=validateFile(JSON.parse(raw));const target=path.join(root,'lib/catalogueUpdates.json'),current=JSON.parse(fs.readFileSync(target,'utf8'));console.log(JSON.stringify(updates,null,2));if(mode==='--apply'){fs.writeFileSync(target,JSON.stringify({...current,...updates},null,2)+'\n');console.log('Applied. Review git diff, then build.');}else console.log('Valid. No files changed.');}catch(e){console.error(e.message);process.exitCode=1;}
}
