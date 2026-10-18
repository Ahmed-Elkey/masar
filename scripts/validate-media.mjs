import {readFileSync, existsSync, statSync} from 'node:fs';
import assert from 'node:assert/strict';
const media=JSON.parse(readFileSync(new URL('../lib/media.json',import.meta.url)));
const source=readFileSync(new URL('../lib/data.ts',import.meta.url),'utf8');
const ids=[...source.matchAll(/id: "([^"]+)"[\s\S]*?url: "([^"]+)"/g)].map(m=>m[1]);
function asset(src,min=100){assert.ok(src.startsWith('/')&&!src.includes('..'),`Unsafe asset ${src}`);const path=new URL('../public'+src,import.meta.url);assert.ok(existsSync(path),`Missing asset ${src}`);assert.ok(statSync(path).size>min,`Empty asset ${src}`);return readFileSync(path);}
let pages=0,logos=0,published=0;
for(const id of ids){const m=media[id];assert.ok(m?.images.length,`Missing photos: ${id}`);for(const image of m.images){asset(image.src,1000);assert.ok(image.source.startsWith('https://'),`Missing provenance ${image.src}`);}
 for(const key of ['brochure','guide'])assert.equal(asset(m[key]).subarray(0,5).toString(),'%PDF-',`Invalid PDF ${id}: ${key}`);
 assert.ok(m.brochurePages?.length,`Missing document previews ${id}`);
 for(const page of m.brochurePages){const bytes=asset(page,1000);assert.equal(bytes[0],255);assert.equal(bytes[1],216);pages++;}
 if(m.brochureKind==='site-guide')assert.equal(m.brochurePages.length,2,`Incomplete bilingual guide ${id}`);else{published++;assert.ok(m.brochureSource?.startsWith('https://'));}
 for(const key of ['logo','projectLogo'])if(m[key]){asset(m[key].src);assert.ok(m[key].source?.startsWith('https://'));logos++;}
}
console.log(`Validated ${ids.length} galleries, ${ids.length} bilingual guides, ${published} published brochures, ${pages} document pages, and ${logos} sourced logos.`);
const landmarkMedia=JSON.parse(readFileSync(new URL('../lib/landmarkMedia.json',import.meta.url)));
for(const [id,photo] of Object.entries(landmarkMedia)){asset(photo.src,1000);assert.ok(photo.author&&photo.license&&photo.source.startsWith('https://'),`Missing photo credit ${id}`);}
const fonts=readFileSync(new URL('../app/fonts.css',import.meta.url),'utf8');
const fontFiles=[...fonts.matchAll(/url\((\/fonts\/[^)]+)\)/g)].map(m=>m[1]);
for(const src of fontFiles)assert.equal(asset(src,1000).subarray(0,4).toString(),'wOF2',`Invalid font ${src}`);
for(const src of ['/fonts/inter-OFL.txt','/fonts/noto-sans-arabic-OFL.txt'])asset(src,1000);
for(let i=1;i<=4;i++)assert.equal(asset(`/map/cloud${i}.webp`,1000).subarray(0,4).toString(),'RIFF');
console.log(`Validated ${Object.keys(landmarkMedia).length} landmark photo credits, ${fontFiles.length} local fonts with licenses, and 4 cloud assets.`);
const places=JSON.parse(readFileSync(new URL('../lib/poiMedia.json',import.meta.url)));
const poiSource=readFileSync(new URL('../lib/poi.ts',import.meta.url),'utf8');
const poiIds=[...poiSource.matchAll(/id: "([^"]+)"/g)].map(m=>m[1]);
for(const id of poiIds){
 const photo=places[id];assert.ok(photo,`Missing service card photo ${id}`);
 const bytes=asset(photo.src,1000);assert.equal(bytes.subarray(0,4).toString(),'RIFF',`Invalid WebP ${id}`);
 assert.ok(photo.author&&photo.license&&photo.page.startsWith('https://')&&photo.source?.startsWith('https://'),`Missing service photo provenance ${id}`);
 assert.ok(['photo','aerial'].includes(photo.kind),`Missing photo type ${id}`);
}
for(const id of ids)assert.ok(media[id].projectLogo||media[id].logo,`Missing visual identity ${id}`);
console.log(`Validated ${poiIds.length} service photo backgrounds and all ${ids.length} project identities (${ids.filter(id=>media[id].projectLogo).length} project marks; remaining identities pair a developer mark with the project name).`);
