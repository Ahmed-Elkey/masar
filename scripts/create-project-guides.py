"""Bilingual, independently prepared site guides; never presented as developer brochures."""
from pathlib import Path
import json,sys,re
sys.path.insert(0,'/tmp/egypt-pdf-tools')
import arabic_reshaper
from bidi.algorithm import get_display
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
root=Path(__file__).resolve().parents[1]
BRAND='Nile Estates';BRAND_MARK='NILE ESTATES';MAP_MARK='EGYPT INVESTMENT MAP';BRAND_AR='نايل إستيتس'
projects=json.loads(Path('/tmp/egypt-projects.json').read_text());media=json.loads((root/'lib/media.json').read_text())
for name,path in [('Body','/System/Library/Fonts/Supplemental/Arial.ttf'),('Bold','/System/Library/Fonts/Supplemental/Arial Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,path))
W,H=595.28,841.89
BLUE='#3278E8';INK='#232323';GRAY='#6B7280'
def ar(s):return get_display(arabic_reshaper.reshape(s))
def text(c,s,x,y,size=12,font='Body',rtl=False,color=INK):
 c.setFillColor(color);c.setFont(font,size);(c.drawRightString if rtl else c.drawString)(x,y,ar(s) if rtl else s)
def wrap(s,width,size=12,font='Body',rtl=False):
 lines=[];line=''
 for word in s.split():
  nxt=(line+' '+word).strip()
  if pdfmetrics.stringWidth(ar(nxt) if rtl else nxt,font,size)>width and line:lines.append(line);line=word
  else:line=nxt
 if line:lines.append(line)
 return lines
def para(c,s,x,y,width,size=12,leading=17,font='Body',rtl=False,color=INK):
 for line in wrap(s,width,size,font,rtl):text(c,line,x,y,size,font,rtl,color);y-=leading
 return y
for p in projects:
 id=p['id']
 if len(sys.argv)>1 and id not in sys.argv[1:]:continue
 m=media[id];dest=root/'output/pdf'/f'{id}-project-guide.pdf';dest.parent.mkdir(parents=True,exist_ok=True)
 c=canvas.Canvas(str(dest),pagesize=(W,H));c.setTitle(p['name']['en']+' | Independent project guide');c.setAuthor(BRAND);c.setSubject(f'English and Arabic project overview prepared by {BRAND}. Not a developer-issued brochure.')
 for lang in ['en','ar']:
  rtl=lang=='ar';margin=42;x=W-margin if rtl else margin
  c.setFillColorRGB(1,1,1);c.rect(0,0,W,H,fill=1,stroke=0)
  image_path=root/'public'/m['images'][0]['src'].lstrip('/')
  im=Image.open(image_path).convert('RGB');box=(W,280);scale=max(W/im.width,280/im.height);im=im.resize((int(im.width*scale),int(im.height*scale)));left=(im.width-int(W))//2;top=(im.height-280)//2;im=im.crop((left,top,left+int(W),top+280))
  c.drawImage(ImageReader(im),0,H-280,W,280)
  c.setFillColorRGB(0.03,.08,.15,alpha=.65);c.rect(0,H-66,W,66,fill=1,stroke=0);c.setFillAlpha(1)
  text(c,BRAND_MARK,margin,H-30,13,'Bold',color='#FFFFFF');text(c,MAP_MARK,margin,H-48,8,color='#FFFFFF')
  text(c,'ملف تعريفي مستقل' if rtl else 'INDEPENDENT PROJECT GUIDE',x,H-312,10,'Bold',rtl,BLUE)
  title=p['name'][lang];y=H-350
  for line in wrap(title,W-2*margin,28,'Bold',rtl):text(c,line,x,y,28,'Bold',rtl);y-=34
  text(c,p['area'][lang],x,y-2,13,'Body',rtl,GRAY);y-=34
  # The guide summarizes the project's displayed description; no prices or sales terms are added.
  y=para(c,p['description'][lang],x,y,W-2*margin,12,17,rtl=rtl)-20
  for label,value in [('المطور' if rtl else 'DEVELOPER',p['developer']),('المنطقة' if rtl else 'LOCATION',p['area'][lang])]:
   text(c,label,x,y,9,'Bold',rtl,GRAY);text(c,value,x,y-20,12,'Body',rtl);y-=48
  text(c,'المميزات' if rtl else 'AMENITIES',x,y,10,'Bold',rtl);y-=18
  for i,a in enumerate(p['amenities'][lang][:6]):
   col=i%2;row=i//2;bx=margin+col*((W-2*margin-12)/2+12);by=y-row*44-32;bw=(W-2*margin-12)/2
   c.setFillColorRGB(.94,.94,.94);c.roundRect(bx,by,bw,36,5,fill=1,stroke=0)
   lines=wrap(a,bw-20,10,'Body',rtl)[:2]
   for j,line in enumerate(lines):text(c,line,bx+bw-10 if rtl else bx+10,by+22-j*12,10,'Body',rtl)
  c.setStrokeColorRGB(.88,.89,.91);c.line(margin,106,W-margin,106)
  note=f'من إعداد {BRAND_AR} اعتمادًا على بيانات وصور صفحة المشروع. ليس بروشورًا صادرًا عن المطور.' if rtl else f'Prepared by {BRAND} from the project listing and imagery. Not issued by the developer.'
  para(c,note,x,89,W-2*margin,8,11,rtl=rtl,color=GRAY)
  label='مصدر المشروع' if rtl else 'PROJECT SOURCE'
  text(c,label,x,54,8,'Bold',rtl,BLUE);c.linkURL(m['page'],(margin,40,W-margin,66),relative=0)
  text(c,'17 OCT 2026  |  '+('02 / 02' if rtl else '01 / 02'),W-margin,24,7,'Body',True,GRAY)
  c.showPage()
 c.save();target=root/'public/brochures'/dest.name;target.write_bytes(dest.read_bytes());m['guide']='/brochures/'+dest.name
 if not m.get('brochure'):m['brochure']=m['guide'];m['brochureKind']='site-guide';m['brochureSource']=m['page']
(root/'lib/media.json').write_text(json.dumps(media,indent=2,ensure_ascii=False));print('Updated bilingual independent guides.')
