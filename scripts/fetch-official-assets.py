from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import urljoin,urlparse
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
import json
root=Path(__file__).resolve().parents[1]
pages={
 'oia':'https://edgeholding.co/index.php/compound/',
 'scene-7':'https://akam.com.eg/scene7-2/',
 'mivida':'https://www.emaarmisr.com/our-communities/mivida-new-cairo/',
 'blanca':'https://somabay.com/real-estate-projects/',
 'fouka-bay':'https://www.tatwermisr.com/fouka-bay',
 'zed':'https://www.oradevelopers.com/',
}
class Tags(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.images=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='a' and d.get('href'):self.links.append(d['href'])
  if t=='img':self.images.append(d)
def fetch(item):
 id,url=item
 try:
  data=urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read().decode('utf-8','replace')
  Path('/tmp/official-'+id+'.html').write_text(data);p=Tags();p.feed(data)
  return id,{'url':url,'links':list(dict.fromkeys(urljoin(url,x) for x in p.links if '.pdf' in x.lower() or 'brochure' in x.lower() or (id=='zed' and ('zed' in x.lower())))),'images':[{'src':urljoin(url,x.get('src','')),'alt':x.get('alt','')} for x in p.images if any(k in str(x).lower() for k in ['logo','oia','scene','mivida','blanca','fouka','zed'])]}
 except Exception as e: print(id,str(e),flush=True);return id,{}
with ThreadPoolExecutor(max_workers=5) as pool:out=dict(pool.map(fetch,pages.items()))
(root/'scripts/official-assets-candidates.json').write_text(json.dumps(out,indent=2))
for id,v in out.items():print(id,'links',v.get('links'), 'logos',str(v.get('images',[])[:8])[:700],flush=True)
