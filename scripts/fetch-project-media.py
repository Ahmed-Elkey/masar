"""Fetch public project images; keep provenance for each asset. Run manually."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request,urlopen
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor
import re,json,html
ROOT=Path(__file__).resolve().parents[1]
class Tags(HTMLParser):
 def __init__(self): super().__init__(); self.og=[]; self.images=[]; self.pdf=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta' and a.get('property')=='og:image': self.og.append(a.get('content',''))
  if tag=='img': self.images.append(a)
  if tag=='a' and '.pdf' in a.get('href','').lower(): self.pdf.append(a['href'])
def fetch(url):
 return urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=25).read()
def run(item):
 id,url=item
 try:
  raw=fetch(url).decode('utf-8','replace'); tags=Tags();tags.feed(raw)
  (ROOT/'public/projects'/f'{id}-source.json').write_text(json.dumps({'url':url,'og':tags.og,'images':tags.images,'pdf':tags.pdf},ensure_ascii=False,indent=2))
  Path('/tmp/egypt-'+id+'.html').write_text(raw)
  print(id, 'images',len(tags.images),'og', tags.og[:1],flush=True)
 except Exception as e: print(id,str(e),flush=True)
s=(ROOT/'lib/data.ts').read_text()
items=re.findall(r'id: "([^"]+)".*?url: "([^"]+)"',s,re.S)
with ThreadPoolExecutor(max_workers=5) as pool: list(pool.map(run,items))
