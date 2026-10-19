import fs from 'node:fs';
import assert from 'node:assert/strict';
const media=JSON.parse(fs.readFileSync('lib/media.json','utf8'));
const variants=JSON.parse(fs.readFileSync('lib/imageVariants.json','utf8'));
const dimensions=JSON.parse(fs.readFileSync('lib/imageDimensions.json','utf8'));
let photos=0,files=0;
for(const project of Object.values(media))for(const image of project.images){
 photos++;
 const dim=dimensions[image.src];
 assert.ok(dim?.width>0&&dim?.height>0,`Missing dimensions: ${image.src}`);
 assert.ok(fs.existsSync(`public${image.src}`),`Missing original: ${image.src}`);
 for(const width of variants[image.src]??[]){
  assert.ok(width<dim.width,`Upscaled or duplicate candidate: ${image.src}`);
  assert.ok(fs.existsSync(`public${image.src.replace(/\.(webp|jpe?g|png)$/i,'')}-${width}.avif`));files++;
 }
}
console.log(`${photos} original photographs and ${files} responsive candidates validated.`);
