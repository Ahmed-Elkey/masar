from pathlib import Path
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor
import json
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'lib/media.json').read_text());candidates=json.loads((root/'scripts/brochure-candidates.json').read_text());official=json.loads((root/'scripts/official-assets-candidates.json').read_text())
assets={
 'scene7-logo':('https://akam.com.eg/wp-content/uploads/2025/10/SCENE7-Logo-New-Capital.png','/logos/scene-7-project.png'),
 'zed-logo':('https://d3lfybzdo3x59a.cloudfront.net/website-assets/zed-sheikh-zayed.png','/logos/zed-project.png'),
 'ora-logo':('https://www.oradevelopers.com/_nuxt/img/ora-logo-greyer.52c8cfb.png','/logos/zed-developer.png'),
 'fouka-brochure':(official['fouka-bay']['links'][0],'/brochures/fouka-bay-published.pdf'),
 'citygate-brochure':('https://citygatenewcairo.com/wp-content/uploads/2023/10/CityGate-New-Cairo-Project-Brochure-Digital-V1.pdf','/brochures/city-gate-published.pdf'),
}
def get(item):
 id,(url,path)=item
 try:
  data=urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read()
  if path.endswith('.pdf') and not data.startswith(b'%PDF'):raise ValueError('Not PDF')
  (root/'public'/path.lstrip('/')).write_bytes(data);print(id,len(data),flush=True);return id,{'src':path,'source':url}
 except Exception as e:print(id,str(e),flush=True);return id,None
with ThreadPoolExecutor(max_workers=5) as pool:got={id:v for id,v in pool.map(get,assets.items()) if v}
for key,id in [('scene7-logo','scene-7'),('zed-logo','zed')]:
 if key in got:manifest[id]['projectLogo']=got[key]
if 'ora-logo' in got:manifest['zed']['logo']={**got['ora-logo'],'alt':'Ora Developers','kind':'developer'}
for key,id,kind in [('fouka-brochure','fouka-bay','developer'),('citygate-brochure','city-gate','published')]:
 if key in got:candidates[id]={**got[key],'kind':kind}
(root/'lib/media.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False));(root/'scripts/brochure-candidates.json').write_text(json.dumps(candidates,indent=2))
