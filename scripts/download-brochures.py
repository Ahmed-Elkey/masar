from pathlib import Path
from urllib.request import Request,urlopen
from concurrent.futures import ThreadPoolExecutor
import json
root=Path(__file__).resolve().parents[1]
# Exact, publicly published files discovered in source pages / indexed document results.
files={
 'jade-park':('https://cityedgedevelopments.com/cityedgedevelopmentswordpress/wp-content/uploads/2025/09/JP-Brochure.pdf','developer'),
 'oia':('https://renzo.app/uploads/projects/brochure%20-%20oia%20new%20capital%20r7%20edge%20holding%20%281%29.pdf','published'),
 'mivida':('https://www.emaarmisr.com/wp-content/uploads/2020/03/Mivida-Signature-Brochure.pdf','developer'),
 'blanca':('https://somabay.com/wp-content/uploads/Blanca-E-brochure-6-Nov-2023-numbered-MP_compressed.pdf','developer'),
 'fouka-bay':('https://tatweermisr.com/docs/fouka-bay-brochure.pdf','developer'),
 'garden-lakes':('https://platinum-egypt.com/wp-content/uploads/2023/12/Garden-Lakes-brochure.pdf','published'),
 '205-towers':('https://new-projects-media.propertyfinder.com/project/e64459c0-987e-4525-8823-1c40f84fbb94/brochure/application/rbvOrSG_bZOR16TKEhyioqVy27BwZAkdiavkAjcfqVs%3D/original.pdf','published'),
}
def get(item):
 id,(url,kind)=item
 try:
  cache=Path('/tmp/jade-park-official.pdf')
  data=cache.read_bytes() if id=='jade-park' and cache.exists() else urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=45).read()
  if not data.startswith(b'%PDF'): raise ValueError('Source did not return a PDF')
  path=f'/brochures/{id}-published.pdf';(root/'public'/path.lstrip('/')).write_bytes(data)
  print(id,len(data),flush=True)
  return id,{'src':path,'source':url,'kind':kind}
 except Exception as e:print(id,str(e),flush=True);return id,None
with ThreadPoolExecutor(max_workers=5) as pool:result={id:d for id,d in pool.map(get,files.items()) if d}
(root/'scripts/brochure-candidates.json').write_text(json.dumps(result,indent=2))
