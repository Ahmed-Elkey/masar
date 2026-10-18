from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
root=Path(__file__).resolve().parents[1]
class P(HTMLParser):
 def __init__(self):super().__init__();self.images=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='img' and any(k in str(d).lower() for k in ['logo','brand']):self.images.append(d)
def get(item):
 id,url=item
 try:
  raw=urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read().decode('utf8','replace');p=P();p.feed(raw);Path('/tmp/developer-'+id+'.html').write_text(raw)
  print(id,[{'src':urljoin(url,x.get('src','')),'alt':x.get('alt','')} for x in p.images[:6]],flush=True)
 except Exception as e:print(id,str(e),flush=True)
with ThreadPoolExecutor(max_workers=3) as p:list(p.map(get,{'beverly-hills':'https://www.sodic.com/','city-gate':'https://www.qataridiar.com/egypt','mivida':'https://www.emaarmisr.com/'}.items()))
