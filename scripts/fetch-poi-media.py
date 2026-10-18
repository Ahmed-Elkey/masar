"""Build local, attributed place imagery. Re-run with exported POIS JSON as argument.
Uses exact-location Esri aerial photographs as the baseline, never generic stock photos.
Verified facade photographs can override these entries in poiMedia.json.
"""
from pathlib import Path
from urllib.request import urlopen,Request
from urllib.parse import urlencode
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
import sys,json,math
from PIL import Image
root=Path(__file__).resolve().parents[1]
pois=json.loads(Path(sys.argv[1]).read_text());folder=root/'public/places';folder.mkdir(exist_ok=True)
def get(p):
 lat,lng=p['lat'],p['lng'];dy=.0025 if p['subtype']!='Airport' else .009;dx=dy*16/9/math.cos(math.radians(lat))
 params={'bbox':f'{lng-dx},{lat-dy},{lng+dx},{lat+dy}','bboxSR':4326,'imageSR':3857,'size':'800,450','format':'jpg','f':'image'}
 u='https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?'+urlencode(params)
 dest=folder/(p['id']+'-aerial.webp')
 if not dest.exists():
  d=urlopen(Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=35).read();im=Image.open(BytesIO(d));im.convert('RGB').save(dest,'WEBP',quality=85)
 return p['id'],{'src':'/places/'+dest.name,'page':'https://www.esri.com/en-us/arcgis/products/arcgis-living-atlas/maps','author':'Esri, Maxar, Earthstar Geographics','license':'World Imagery','kind':'aerial','source':u,'coordinates':[lng,lat]}
manifest=root/'lib/poiMedia.json'
existing=json.loads(manifest.read_text()) if manifest.exists() else {}
result={}
with ThreadPoolExecutor(max_workers=5) as ex:
 for k,v in ex.map(get,pois):
  result[k]=existing[k] if existing.get(k,{}).get('kind')=='photo' else v
  print(k,flush=True)
manifest.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Local photo backgrounds:',len(result))
