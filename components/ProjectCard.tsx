"use client";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STRINGS } from "@/lib/i18n";
import type { Lang, Project } from "@/lib/types";
import { Icon } from "./Icon";
import ProjectImage, { projectMedia } from "./ProjectImage";
import ProjectWordmark from "./ProjectWordmark";
import SatelliteThumb from "./SatelliteThumb";
import PhotoViewer from "./PhotoViewer";
interface Props {project:Project;lang:Lang;onClose:()=>void;exiting?:boolean;}
export default function ProjectCard({project:p,lang,onClose,exiting=false}:Props) {
  const [details,setDetails]=useState(false);
  const [gallery,setGallery]=useState(false);
  const [group,setGroup]=useState<"photos"|"site"|"brochure">("photos");
  const [photo,setPhoto]=useState(0);
  const [photosOpen,setPhotosOpen]=useState(true);
  const [documentsOpen,setDocumentsOpen]=useState(false);
  const [documentPage,setDocumentPage]=useState(0);
  const [documentZoom,setDocumentZoom]=useState(1);
  const amenRef=useRef<HTMLUListElement>(null);
  const cardRef=useRef<HTMLElement>(null);
  useEffect(() => { cardRef.current?.toggleAttribute("inert", exiting); }, [exiting]);
  const sheetDrag=useRef<{y:number;height:number}|null>(null);
  const sheetMoved=useRef(false);
  const [sheetSize,setSheetSize]=useState<number|null>(null);
  const sheetLimits=()=>({min:window.innerWidth<=560?180:200,max:window.innerHeight*(document.querySelector('.app')?.classList.contains('has-place') ? 0.6 : 0.85)});
  const resizeSheet=(height:number)=>{const limit=sheetLimits();setSheetSize(Math.max(limit.min,Math.min(limit.max,height)));};
  useEffect(()=>{
    const card=cardRef.current,app=document.querySelector<HTMLElement>('.app');if(!card||!app)return;
    const sync=()=>{if(window.innerWidth<=900)app.style.setProperty('--project-sheet-height',`${card.getBoundingClientRect().height}px`);else app.style.removeProperty('--project-sheet-height');};
    const observer=new ResizeObserver(sync);observer.observe(card);window.addEventListener('resize',sync);sync();
    return()=>{observer.disconnect();window.removeEventListener('resize',sync);app.style.removeProperty('--project-sheet-height');};
  },[]);
  const overlayRef=useRef<HTMLDivElement>(null);
  const restoreFocus=useRef<HTMLElement|null>(null);
  const t=STRINGS[lang], media=projectMedia(p), count=Math.max(1,media.images.length);
  const documentPages=media.brochurePages??[];
  const documentCount=documentPages.length;
  const isGuide=media.brochureKind==="site-guide";
  const documentLabel=isGuide?t.projectGuide:t.brochure;
  const downloadLabel=isGuide?t.downloadGuide:t.downloadBrochure;
  useEffect(()=>setPhoto(prev=>Math.min(prev,count-1)),[count]);
  const moveDocument=(delta:number)=>{setDocumentPage(prev=>(prev+delta+documentCount)%Math.max(1,documentCount));setDocumentZoom(1);};
  const openBrochure=()=>{setGallery(true);setGroup("brochure");setPhotosOpen(false);setDocumentsOpen(true);setDocumentZoom(1);};
  const movePhoto=(delta:number)=>setPhoto(prev=>(prev+delta+count)%count);
  const openGallery=()=>{setGallery(true);setPhotosOpen(true);setGroup("photos");setDocumentsOpen(false);};
  const modalOpen=details||gallery;
  useEffect(()=>{
    if(!modalOpen)return;
    restoreFocus.current=document.activeElement as HTMLElement;
    const app=document.querySelector<HTMLElement>(".app");
    if(app){app.inert=true;app.setAttribute("aria-hidden","true");}
    return()=>{if(app){app.inert=false;app.removeAttribute("aria-hidden");}if(restoreFocus.current?.isConnected)restoreFocus.current.focus();};
  },[modalOpen]);
  useEffect(()=>{
    if(details||gallery)overlayRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  },[details,gallery]);
  useEffect(()=>{
    if(!details&&!gallery)return;
    const key=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){event.preventDefault();if(gallery)setGallery(false);else setDetails(false);}
      if(gallery&&["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(event.key)){event.preventDefault();if(group==="photos")movePhoto((event.key==="ArrowRight"||event.key==="ArrowDown")?1:-1);else if(group==="brochure")moveDocument((event.key==="ArrowRight"||event.key==="ArrowDown")?1:-1);}
      if(event.key==="Tab"){
        const els=Array.from(overlayRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex="0"]')??[]).filter(el=>el.getClientRects().length);
        if(!els.length)return;
        const first=els[0],last=els[els.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    window.addEventListener("keydown",key);
    return()=>window.removeEventListener("keydown",key);
    // The keyboard handler uses functional photo updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[details,gallery,group,count,documentCount]);
  const scrollAmenities=()=>{
    const el=amenRef.current;if(!el)return;
    const behavior=window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";
    const end=Math.abs(el.scrollLeft)+el.clientWidth>=el.scrollWidth-5;
    if(end)el.scrollTo({left:0,behavior});
    else el.scrollBy({left:(lang==="ar"?-1:1)*(el.clientWidth/2+6),behavior});
  };
  return <>
    <aside ref={cardRef} className={`card${exiting?' is-exiting':''}${sheetSize!==null?' is-sized':''}${sheetSize!==null&&sheetSize<=200?' is-collapsed':''}`} style={sheetSize!==null?{'--mobile-sheet-size':`${sheetSize}px`} as CSSProperties:undefined} aria-label={p.name[lang]}>
      <button className="sheet-handle" aria-label={lang==='ar'?'توسيع أو تصغير بطاقة المشروع':'Expand or collapse project card'} aria-expanded={sheetSize===null||sheetSize>200}
        onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);sheetMoved.current=false;sheetDrag.current={y:event.clientY,height:cardRef.current?.getBoundingClientRect().height??200};}}
        onPointerMove={event=>{const start=sheetDrag.current;if(!start)return;if(Math.abs(event.clientY-start.y)>5)sheetMoved.current=true;resizeSheet(start.height+start.y-event.clientY);}}
        onPointerUp={()=>{sheetDrag.current=null;}} onPointerCancel={()=>{sheetDrag.current=null;}}
        onClick={()=>{if(sheetMoved.current){sheetMoved.current=false;return;}const limit=sheetLimits();resizeSheet((sheetSize??cardRef.current?.getBoundingClientRect().height??limit.max)>limit.min+20?limit.min:limit.max);}}
        onKeyDown={event=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();const limit=sheetLimits(),current=cardRef.current?.getBoundingClientRect().height??limit.min;resizeSheet(event.key==='Home'?limit.min:event.key==='End'?limit.max:current+(event.key==='ArrowUp'?50:-50));}}><span/></button>
      <div className="card-hero">
        <PhotoViewer project={p} lang={lang} index={photo} onMove={movePhoto} hero/>
        <div className="card-logo"><ProjectWordmark project={p} lang={lang} variant="hero"/></div>
        <button className="card-x" aria-label={t.close} onClick={onClose}><Icon name="close" size={16}/></button>
        <button className="hero-gallery" aria-label={t.galleries} onClick={openGallery}><Icon name="gallery" size={22}/></button>
        <span className="card-status">{t.status[p.status]}</span>
        {count>1&&<div className="hero-dots">{media.images.map((_,i)=><button key={i} className={photo===i?"is-on":""} aria-label={`${t.imageCount} ${i+1}`} aria-pressed={photo===i} onClick={()=>setPhoto(i)}/>)}</div>}
      </div>
      <div className="card-body">
        <div className="developer-identity">{media.logo&&<img src={media.logo.src} alt={media.logo.alt}/>}<span><small>{t.developer}</small><b>{p.developer}</b></span></div>
        <p className="card-desc">{p.description[lang]}</p>
        <div className="card-section"><span>{t.amenities}</span><button aria-label={`${t.next}: ${t.amenities}`} onClick={scrollAmenities}><Icon name="chevronRight" size={18}/></button></div>
        <ul className="chips" ref={amenRef}>{p.amenities[lang].map(a=><li className="chip" key={a}>{a}</li>)}</ul>
        <h3 className="gallery-title">{t.galleries}</h3>
        <div className="gallery-links"><button onClick={openGallery}><Icon name="gallery" size={18}/>{t.photos}</button><button onClick={()=>{setGallery(true);setGroup("site");}}><Icon name="pin" size={18}/>{t.gallery}</button>{media.brochure&&<button onClick={openBrochure}><Icon name="brochure" size={18}/>{documentLabel}</button>}</div>
        {p.areaApprox&&<p className="card-note">{t.coordinatesApprox}</p>}
      </div>
      <footer className="card-footer"><button className="btn btn-primary" onClick={()=>setDetails(true)}>{t.viewProject}<Icon name="chevronRight" size={16}/></button>{media.brochure?<a className="btn btn-secondary" href={media.brochure} target="_blank" rel="noreferrer" download><Icon name="download" size={16}/>{downloadLabel}</a>:<a className="btn btn-secondary" href={p.url} target="_blank" rel="noreferrer"><Icon name="globe" size={16}/>{t.source}</a>}</footer>
    </aside>
    {(details||gallery)&&createPortal(<div className={`project-overlay ${gallery?"gallery-overlay":"detail-overlay"}`} ref={overlayRef} data-project-overlay role="dialog" aria-modal="true" aria-label={`${p.name[lang]} — ${gallery?t.galleries:t.viewProject}`}>
      {gallery?<>
        <aside className="gallery-sidebar"><div className="gallery-header"><button className="btn btn-primary back" onClick={()=>setGallery(false)}><Icon name="chevronLeft" size={16}/>{t.back}</button></div>
          <button className="gallery-group" aria-expanded={photosOpen} onClick={()=>{setPhotosOpen(!photosOpen);setGroup("photos");}}><Icon name={photosOpen?"minus":"plus"} size={14}/>{t.photos}</button>
          {photosOpen&&<div className="gallery-thumbnails">{Array.from({length:count},(_,i)=><button key={i} className={photo===i&&group==="photos"?"is-on":""} aria-label={`${t.imageCount} ${i+1}`} aria-pressed={photo===i&&group==="photos"} onClick={()=>{setPhoto(i);setGroup("photos");}}><ProjectImage project={p} index={i} lang={lang} sizes="(max-width: 560px) 90px, (max-width: 900px) 188px, 128px"/></button>)}</div>}
          <button className={`gallery-group ${group==="site"?"is-on":""}`} aria-pressed={group==="site"} onClick={()=>setGroup(prev=>prev==="site"?"photos":"site")}><Icon name={group==="site"?"minus":"plus"} size={14}/>{t.gallery}</button>
          {media.brochure&&<>
            <button className={`gallery-group ${group==="brochure"?"is-on":""}`} aria-expanded={documentsOpen} onClick={()=>{setGroup("brochure");setDocumentsOpen(group==="brochure"?!documentsOpen:true);setPhotosOpen(false);}}><Icon name={documentsOpen?"minus":"plus"} size={14}/>{documentLabel}</button>
            {documentsOpen&&<div className="gallery-thumbnails document-thumbnails">{documentPages.map((src,i)=><button key={src} className={group==="brochure"&&documentPage===i?"is-on":""} aria-label={`${t.brochurePage} ${i+1}`} aria-pressed={group==="brochure"&&documentPage===i} onClick={()=>{setDocumentPage(i);setDocumentZoom(1);setGroup("brochure");}}><img src={src} alt={`${p.name[lang]} — ${t.brochurePage} ${i+1}`} loading="lazy"/><small>{i+1}</small></button>)}</div>}
            <a className="document-download" href={media.brochure} download><Icon name="download" size={16}/>{downloadLabel}</a>
            {isGuide&&<p className="guide-note">{t.guideNote}</p>}{media.brochureNote&&<p className="guide-note">{media.brochureNote[lang]}</p>}
          </>}
        </aside>
        <div className="gallery-stage">{group==="site"?<SatelliteThumb lat={p.lat} lng={p.lng} zoom={p.heroZoom??16} grid={5} alt={p.name[lang]}/>:group==="brochure"?<>
          <div className={`document-scroll ${documentZoom>1?"is-zoomed":""}`}>{documentPages[documentPage]?<img src={documentPages[documentPage]} alt={`${documentLabel} — ${t.brochurePage} ${documentPage+1}`} style={{width:documentZoom===1?"auto":`${documentZoom*100}%`,maxWidth:documentZoom===1?"100%":"none",maxHeight:documentZoom===1?"100%":"none"}}/>:<iframe src={media.brochure??""} title={documentLabel}/>}</div>
          <div className="document-actions"><button aria-label={t.zoomIn} onClick={()=>setDocumentZoom(prev=>Math.min(3,prev+.5))}><Icon name="plus" size={18}/></button><button aria-label={t.zoomOut} onClick={()=>setDocumentZoom(prev=>Math.max(1,prev-.5))}><Icon name="minus" size={18}/></button><a href={media.brochure??""} target="_blank" rel="noreferrer">{t.openDocument}</a></div>
        </>:<PhotoViewer project={p} lang={lang} index={photo} onMove={movePhoto}/>}
          {((group==="photos"&&count>1)||(group==="brochure"&&documentCount>1))&&<><button className="gallery-prev" aria-label={t.previous} onClick={()=>group==="brochure"?moveDocument(-1):movePhoto(-1)}><Icon name="chevronLeft"/></button><button className="gallery-next" aria-label={t.next} onClick={()=>group==="brochure"?moveDocument(1):movePhoto(1)}><Icon name="chevronRight"/></button></>}
          <span className="gallery-caption">{p.name[lang]} · {group==="photos"?`${photo+1} / ${count}`:group==="brochure"?`${documentLabel} · ${documentPage+1} / ${documentCount}`:t.gallery}</span>
        </div>
      </>:<>
        <div className="details-background"><ProjectImage project={p} lang={lang} eager sizes="100vw"/></div>
        <button className="btn btn-primary details-back" onClick={()=>setDetails(false)}><Icon name="chevronLeft" size={16}/>{t.back}</button>
        <nav className="details-tools" aria-label={t.galleries}><button onClick={openGallery}><Icon name="gallery" size={22}/>{t.photos}</button><button onClick={()=>{setGallery(true);setGroup("site");}}><Icon name="pin" size={22}/>{t.gallery}</button>{media.brochure&&<button onClick={openBrochure}><Icon name="brochure" size={22}/>{documentLabel}</button>}</nav>
        <section className="details-summary"><span className="details-status">{t.status[p.status]}</span>{media.projectLogo&&<ProjectWordmark project={p} lang={lang} variant="details"/>}<h1>{p.name[lang]}</h1><p>{p.description[lang]}</p><button className="btn btn-primary" onClick={openGallery}>{t.galleries}</button><h2>{t.amenities}</h2><ul>{p.amenities[lang].map(a=><li key={a}>{a}</li>)}</ul><dl><dt>{t.developer}</dt><dd>{p.developer}</dd><dt>{t.area}</dt><dd>{p.area[lang]}</dd></dl><a className="details-source" href={p.url} target="_blank" rel="noreferrer">{t.source}<Icon name="chevronRight" size={14}/></a></section>
      </>}
    </div>,document.body)}
  </>;
}
