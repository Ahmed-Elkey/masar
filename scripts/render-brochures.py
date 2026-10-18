from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,subprocess,re
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'lib/media.json').read_text());published=json.loads((root/'scripts/brochure-candidates.json').read_text())
for id,doc in published.items():
 manifest[id]['brochure']=doc['src'];manifest[id]['brochureKind']=doc['kind'];manifest[id]['brochureSource']=doc['source']
# Each PDF page gets a real local preview, so the entire document is navigable.
def render(item):
 id,m=item;file=root/'public'/m['brochure'].lstrip('/');dest=root/'public/brochures/pages'/id;dest.mkdir(exist_ok=True)
 result=subprocess.run(['pdftoppm','-scale-to','1000','-jpeg','-jpegopt','quality=72',str(file),str(dest/'page')],capture_output=True)
 if result.returncode:raise RuntimeError(id+': '+result.stderr.decode()[:250])
 pages=sorted(dest.glob('page-*.jpg'),key=lambda p:int(re.search(r'(\d+)\.jpg$',p.name).group(1)))
 m['brochurePages']=['/'+str(p.relative_to(root/'public')) for p in pages]
 print(id,m['brochureKind'],len(pages),'pages',flush=True)
 return id,m
with ThreadPoolExecutor(max_workers=3) as pool:manifest=dict(pool.map(render,manifest.items()))
(root/'lib/media.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
