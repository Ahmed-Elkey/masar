from pathlib import Path
from urllib.parse import urlparse,parse_qs,urljoin
from urllib.request import urlopen,Request
from concurrent.futures import ThreadPoolExecutor
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
def decode(src,base):
 if src.startswith('/_next/image?'): src=parse_qs(urlparse(src).query).get('url',[''])[0]
 return urljoin(base,src)
def run(p):
 id=p.name.removesuffix('-source.json');d=json.loads(p.read_text()); candidates=[]
 for im in d['images']:
  alt=im.get('alt','');src=decode(im.get('src',''),d['url'])
  if 'ahlanhomes' in d['url']: good='snap-center' in im.get('class','')
  elif 'doestate' in d['url']: good=bool(alt) and ('photo' in alt.lower() or len(candidates)==0) and 'pub-' in src
  else: good='Eclat Port Said Compound New Plan Real Estate' in alt
  if good and src not in candidates and src.startswith('https:'): candidates.append(src)
 out=[];seen=set()
 for i,u in enumerate(candidates[:6]):
  try:
   data=urlopen(Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read()
   if len(data)<1000: continue
   digest=hashlib.sha256(data).hexdigest()
   if digest in seen: continue
   seen.add(digest)
   ext=Path(urlparse(u).path).suffix.lower()
   if ext not in ['.jpg','.png','.webp','.jpeg']:continue
   name=f'{id}-{i}{ext}';(ROOT/'public/projects'/name).write_bytes(data)
   out.append({'src':'/projects/'+name,'source':u})
  except Exception as e: print(id,i,str(e),flush=True)
 print(id,len(out),flush=True)
 return id,{'images':out,'page':d['url'],'brochure':d['pdf'][0] if d['pdf'] else None}
with ThreadPoolExecutor(max_workers=6) as pool: manifest=dict(pool.map(run,sorted((ROOT/'public/projects').glob('*-source.json'))))
(ROOT/'lib/media.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
