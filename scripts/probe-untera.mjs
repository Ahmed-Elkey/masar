// Public, read-only connectivity probe. Never reads or sends API keys.
import fs from 'node:fs/promises';
const results=[];
for(const path of ['sources','listings/search?country=EG&pageSize=2']){
 try{
  const r=await fetch('https://api.untera.io/api/v1/'+path,{redirect:'error',signal:AbortSignal.timeout(10000)});
  const reader=r.body?.getReader();let body='',bytes=0;const decoder=new TextDecoder();
  if(reader)while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>1000000){await reader.cancel();throw Error('size');}body+=decoder.decode(value,{stream:true});}
  body+=decoder.decode();const result={path,status:r.status};
  if(r.ok){await fs.mkdir('tmp',{recursive:true});await fs.writeFile('tmp/untera-'+(path==='sources'?'sources':'egypt-sample')+'.json',body);result.sampleSaved=true;}
  results.push(result);
 }catch(e){results.push({path,error:e.name==='TimeoutError'?'timeout':e.cause?.code??'connection_failed'});}
}
console.log(JSON.stringify(results,null,2));if(results.some(r=>r.status!==200))process.exitCode=1;
