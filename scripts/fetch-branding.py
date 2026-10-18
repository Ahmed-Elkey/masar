from pathlib import Path
from urllib.parse import urlparse,parse_qs
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor
import json
root=Path(__file__).resolve().parents[1]
candidates=json.loads(Path('/tmp/branding-candidates.json').read_text());manifest=json.loads((root/'lib/media.json').read_text())
# Only image tags explicitly identified as the developer in a project's page.
selected={}
for id,images in candidates.items():
 good=[i for i in images if i['src'] and ('logo_image' in i['src'] or (id=='eclat-port-said' and i['alt']=='New Plan'))]
 if good:
  i=good[0];src=i['src'];src=parse_qs(urlparse(src).query).get('url',[src])[0];selected[id]={'url':src,'alt':i['alt']}
# Reuse the same verified developer identity across that developer's projects.
for id,other in {'il-bosco':'vinci'}.items(): selected[id]=selected[other]
def get(item):
 id,d=item
 try:
  content=urlopen(Request(d['url'],headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read()
  ext=Path(urlparse(d['url']).path).suffix;path='/logos/'+id+ext
  (root/'public'/path.lstrip('/')).write_bytes(content)
  return id,{'src':path,'source':d['url'],'alt':d['alt'],'kind':'developer'}
 except Exception as e:print(id,str(e),flush=True);return id,None
with ThreadPoolExecutor(max_workers=5) as pool:
 for id,logo in pool.map(get,selected.items()):
  if logo:manifest[id]['logo']=logo
(root/'lib/media.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
print('Verified developer logos:',sum('logo' in v for v in manifest.values()))
