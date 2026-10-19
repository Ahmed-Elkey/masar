"use client";
import type maplibregl from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CARD_HALF_WIDTH, LANDMARKS, MAX_ZOOM, MIN_ZOOM, PROJECTS, PROJECT_VIEW } from "@/lib/data";
import { useDrivingRoute } from "@/lib/useDrivingRoute";
import { useCardPresence } from "@/lib/useCardPresence";
import { useCardLayoutMotion } from "@/lib/useCardLayoutMotion";
import PlaceCard from "./PlaceCard";
import ExpandSearch from "./ExpandSearch";
import ComparisonConnector from "./ComparisonConnector";
import { STRINGS } from "@/lib/i18n";
import type { IconName } from "@/lib/icons";
import { POIS } from "@/lib/poi";
import type { Lang, LayerId, StatusId, Theme } from "@/lib/types";
import { readUrlState, useSyncUrlAndHtml } from "@/lib/useUrlState";
import { Icon } from "./Icon";
import MapCanvas from "./MapCanvas";
import ProjectCard from "./ProjectCard";
import ProjectImage from "./ProjectImage";
import Link from "next/link";
import { Seal } from "./estate/Brand";
const TOOLS: {id: LayerId; icon: IconName; key: keyof (typeof STRINGS)["en"]["tools"]}[] = [
  {id:"landmarks",icon:"pin",key:"landmarks"}, {id:"school",icon:"brochure",key:"schools"},
  {id:"health",icon:"heart",key:"health"}, {id:"shopping",icon:"bag",key:"shopping"},
  {id:"roads",icon:"road",key:"roads"}, {id:"transit",icon:"metro",key:"transit"},
];
export default function MapApp({ onMapReady, onMapProgress }: { onMapReady?: () => void; onMapProgress?: (value: number) => void }) {
  const [lang,setLang] = useState<Lang>("en");
  const [theme,setTheme] = useState<Theme>("light");
  const [hydrated,setHydrated] = useState(false);
  const [layers,setLayers] = useState<LayerId[]>(["landmarks"]);
  const [selectedId,setSelectedId] = useState<string|null>(null);
  const [selectedPoiId,setSelectedPoiId] = useState<string|null>(null);
  const [drawer,setDrawer] = useState(false);
  const drawerPresence = useCardPresence(drawer ? true : undefined);
  const [menu,setMenu] = useState(false);
  const [filters,setFilters] = useState(false);
  const [projectQuery,setProjectQuery] = useState("");
  const [areaFilter,setAreaFilter] = useState("all");
  const [statusFilter,setStatusFilter] = useState<StatusId|"all">("all");
  const [openPill,setOpenPill] = useState<"area"|"status"|null>(null);
  const [searchOpen,setSearchOpen] = useState(false);
  const [sharing,setSharing] = useState(false);
  const [about,setAbout] = useState(false);
  const [toast,setToast] = useState<string|null>(null);
  const [fullscreenActive,setFullscreenActive] = useState(false);
  const mapRef = useRef<maplibregl.Map|null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const t = STRINGS[lang];
  const projectAreas = useMemo(() => {
    const areas = new Map<string,string>();
    PROJECTS.forEach(p => { if (!areas.has(p.area.en)) areas.set(p.area.en, p.area[lang]); });
    return [...areas].sort((a,b) => a[1].localeCompare(b[1], lang === "ar" ? "ar" : "en"));
  }, [lang]);
  const filteredProjects = useMemo(() => {
    const query = projectQuery.trim().toLowerCase();
    return PROJECTS.filter(p =>
      (areaFilter === "all" || p.area.en === areaFilter) &&
      (statusFilter === "all" || p.status === statusFilter) &&
      (!query || [p.name[lang], p.name.en, p.name.ar, p.developer, p.area[lang]]
        .some(value => value.toLowerCase().includes(query)))
    );
  }, [projectQuery, areaFilter, statusFilter, lang]);
  const filterActive = projectQuery.trim() !== "" || areaFilter !== "all" || statusFilter !== "all";
  const matchedIds = useMemo(() => new Set(filteredProjects.map(p => p.id)), [filteredProjects]);
  const selected = PROJECTS.find(p => p.id === selectedId);
  const areaLabel = areaFilter === "all" ? t.allAreas : projectAreas.find(([value]) => value === areaFilter)?.[1] ?? areaFilter;
  const statusLabel = statusFilter === "all" ? t.allStatuses : t.status[statusFilter];
  const selectedLandmark = LANDMARKS.find(p => `landmark:${p.id}` === selectedPoiId);
  const selectedPlace = selectedLandmark ?? POIS.find(p=>p.id===selectedPoiId);
  const projectCard = useCardPresence(selected);
  const placeCard = useCardPresence(selectedPlace);
  const retainedLandmark = Boolean(placeCard.value && LANDMARKS.some(place => place.id === placeCard.value?.id));
  const route = useDrivingRoute(selectedId,selectedPoiId);
  useCardLayoutMotion(`${projectCard.value?.id ?? ""}:${placeCard.value?.id ?? ""}:${projectCard.exiting}:${placeCard.exiting}:${lang}:${route.status}`);
  useEffect(() => {
    const state = readUrlState(); setLang(state.lang); setTheme(state.theme);
    const id = new URLSearchParams(location.search).get("project");
    if (PROJECTS.some(p => p.id === id)) setSelectedId(id);
    const landmark = new URLSearchParams(location.search).get("landmark");
    if(LANDMARKS.some(p=>p.id===landmark))setSelectedPoiId(`landmark:${landmark}`);
    else {const poi=new URLSearchParams(location.search).get("poi");if(POIS.some(p=>p.id===poi)){setSelectedPoiId(poi);const category=POIS.find(p=>p.id===poi)!.category;setLayers(prev=>[...prev,({school:"school",mall:"shopping",health:"health",transit:"transit"} as const)[category]]);}}
    setHydrated(true);
    return () => clearTimeout(toastTimer.current);
  },[]);
  useSyncUrlAndHtml(lang,theme,hydrated,selectedId,selectedLandmark?.id??null,selectedPoiId&&!selectedLandmark?selectedPoiId:null);
  const notify = (message:string) => { clearTimeout(toastTimer.current); setToast(message); toastTimer.current=setTimeout(() => setToast(null),2500); };
  const flyToProject = useCallback((id:string) => {
    const p=PROJECTS.find(p=>p.id===id), map=mapRef.current;
    if (!p || !map) return;
    const rtl=document.documentElement.dir==="rtl", mobile=window.innerWidth<=900;
    map.flyTo({center:[p.lng,p.lat],zoom:PROJECT_VIEW.zoom,pitch:PROJECT_VIEW.pitch,bearing:PROJECT_VIEW.bearing,
      offset:mobile ? [0,-window.innerHeight*.18] : [rtl ? CARD_HALF_WIDTH : -CARD_HALF_WIDTH,0],
      duration:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1400});
  },[]);
  const select = (id:string|null) => { setSelectedId(id); setDrawer(false); if(id===selectedId&&id) flyToProject(id); };
  useEffect(() => {
    // Closing a place leaves the camera where the comparison was shown.
    if (selectedId && !selectedPoiId) flyToProject(selectedId);
    // Place changes are handled by the route camera, not the project flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[lang,selectedId,flyToProject]);
  useEffect(()=>{
    const resize = () => { if(selectedId&&!selectedPoiId) flyToProject(selectedId); };
    window.addEventListener("resize",resize);
    return () => window.removeEventListener("resize",resize);
  },[selectedId,selectedPoiId,flyToProject]);
  useEffect(() => {
    if (drawer && selectedId) railRef.current?.querySelector<HTMLElement>(`[data-id="${selectedId}"]`)?.scrollIntoView({block:"nearest",inline:"center"});
  },[drawer,selectedId]);
  useEffect(() => {
    railRef.current?.toggleAttribute("inert", !drawer);
  }, [drawer, drawerPresence.value]);
  useEffect(() => {
    if (!drawer) { setOpenPill(null); setSearchOpen(false); }
  }, [drawer]);
  useEffect(() => {
    if (!openPill && !searchOpen) return;
    const outside = (event:PointerEvent) => {
      if (!(event.target as Element).closest(".rail-pills")) {
        setOpenPill(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [openPill, searchOpen]);
  useEffect(() => {
    const escape=(event:KeyboardEvent) => {
      if(event.key!=="Escape" || document.querySelector("[data-project-overlay]") || document.fullscreenElement) return;
      if(openPill) { setOpenPill(null); document.querySelector<HTMLButtonElement>(`.rail-pill-${openPill} .rail-pill-main`)?.focus(); }
      else if(searchOpen) { setSearchOpen(false); document.querySelector<HTMLButtonElement>(".rail-search-toggle")?.focus(); }
      else if(menu || filters || about) {document.querySelector<HTMLButtonElement>(menu?".menu-btn":filters?".filter-toggle":".info")?.focus();setMenu(false);setSharing(false);setFilters(false);setAbout(false);}
      else if(drawer) { setDrawer(false); document.querySelector<HTMLButtonElement>(".all")?.focus(); }
      else if(selectedPoiId) setSelectedPoiId(null);
      else setSelectedId(null);
    };
    const fs=()=>setFullscreenActive(Boolean(document.fullscreenElement));
    window.addEventListener("keydown",escape); document.addEventListener("fullscreenchange",fs);
    return ()=>{window.removeEventListener("keydown",escape);document.removeEventListener("fullscreenchange",fs);};
  },[menu,filters,about,openPill,searchOpen,drawer,selectedPoiId]);
  useEffect(()=>{
    if(!menu&&!filters&&!about)return;
    const outside=(event:PointerEvent)=>{
      const target=event.target as Element;
      if(menu&&!target.closest('.menu-panel,.menu-btn')){setMenu(false);setSharing(false);}
      if(filters&&!target.closest('.tools,.filter-toggle'))setFilters(false);
      if(about&&!target.closest('.about,.info'))setAbout(false);
    };
    document.addEventListener('pointerdown',outside);
    return()=>document.removeEventListener('pointerdown',outside);
  },[menu,filters,about]);
  const toggleLayer = (id:LayerId) => {
    const enabling=!layers.includes(id);
    setLayers(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
    const poi=POIS.find(p=>p.id===selectedPoiId);
    const selectedLayer=selectedLandmark?"landmarks":poi?({school:"school",health:"health",mall:"shopping",transit:"transit"} as const)[poi.category]:null;
    if(!enabling&&selectedLayer===id)setSelectedPoiId(null);
    const cat = ({school:"school",health:"health",shopping:"mall",transit:"transit"} as const)[id as "school"|"health"|"shopping"|"transit"];
    const map=mapRef.current;
    if(!enabling||!cat||!map)return;
    const items=POIS.filter(p=>p.category===cat);
    // Egypt's destinations are much farther apart than Dubai's. If this view
    // has no matching places, reveal the nearest verified places instead of
    // leaving the newly enabled layer apparently empty.
    if(!items.length||items.some(p=>map.getBounds().contains([p.lng,p.lat])))return;
    const center=map.getCenter();
    const nearest=[...items].sort((a,b)=>(a.lng-center.lng)**2+(a.lat-center.lat)**2-((b.lng-center.lng)**2+(b.lat-center.lat)**2)).slice(0,5);
    const pad=Math.min(70,window.innerWidth*.12,window.innerHeight*.12);
    const rtl=document.documentElement.dir==="rtl", mobile=window.innerWidth<=900;
    map.fitBounds([[Math.min(...nearest.map(p=>p.lng)),Math.min(...nearest.map(p=>p.lat))],[Math.max(...nearest.map(p=>p.lng)),Math.max(...nearest.map(p=>p.lat))]],{duration:motionDuration(1000),maxZoom:12,pitch:25,bearing:0,padding:{top:pad,bottom:mobile&&selected?window.innerHeight*.52:pad,left:pad+(!mobile&&selected&&rtl?384:0),right:pad+(!mobile&&selected&&!rtl?384:0)}});
  };
  const motionDuration=(ms:number)=>window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:ms;
  const zoomBy = (delta:number) => {const map=mapRef.current;if(map)map.easeTo({zoom:Math.min(MAX_ZOOM,Math.max(MIN_ZOOM,map.getZoom()+delta)),duration:motionDuration(250)});};
  const fitAll = () => {
    const map=mapRef.current;if(!map)return;
    setSelectedId(null);setSelectedPoiId(null);setDrawer(false);
    const lngs=PROJECTS.map(p=>p.lng),lats=PROJECTS.map(p=>p.lat);
    const padding=Math.min(100,window.innerWidth*.15,window.innerHeight*.15);
    map.fitBounds([[Math.min(...lngs),Math.min(...lats)],[Math.max(...lngs),Math.max(...lats)]],{padding,duration:motionDuration(1000),maxZoom:13,pitch:0,bearing:0});
  };
  const fullscreen = async () => {
    try {const exiting=Boolean(document.fullscreenElement);if(exiting)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else throw new Error();if(!exiting&&!document.fullscreenElement)throw new Error();setMenu(false);setSharing(false);}
    catch {notify(lang==="ar"?"ملء الشاشة غير متاح في هذا المتصفح":"Fullscreen is unavailable in this browser");}
  };
  const copyLink=async()=>{try{await navigator.clipboard.writeText(location.href);notify(t.shared);}catch{notify(location.href);}};
  const shareUrl=hydrated?window.location.href:"";
  return <div className={`app estate-map theme-${theme}${projectCard.value?" has-card":""}${drawer?" has-drawer":""}${placeCard.value?" has-place":""}`}>
    <div className="map-wrap"><MapCanvas projects={PROJECTS} pois={POIS} lang={lang} theme={theme} layers={layers}
      selectedId={selectedId} selectedPoiId={selectedPoiId} route={route} onSelectProject={select} filterActive={filterActive} matchedIds={matchedIds}      onSelectPoi={id=>{setSelectedPoiId(prev=>prev===id?null:id);setDrawer(false);}}
      onReady={map=>{mapRef.current=map;const requested=new Set<string>();const loaded=new Set<string>();let revealed=false;const finish=()=>{if(revealed)return;revealed=true;onMapProgress?.(100);onMapReady?.();};const keyOf=(event:{sourceId?:string;tile?:{tileID?:{key?:string}}})=>{const key=event.tile?.tileID?.key;return key==null?null:`${event.sourceId??""}:${key}`;};const report=()=>{if(revealed)return;const total=requested.size;onMapProgress?.(total===0?0:Math.min(99,Math.round(loaded.size/total*100)));};map.on("sourcedataloading",event=>{const key=keyOf(event);if(key){requested.add(key);report();}});map.on("data",event=>{const sourceEvent=event as unknown as {sourceId?:string;tile?:{tileID?:{key?:string}}};if(sourceEvent.tile){const key=keyOf(sourceEvent);if(key){requested.add(key);loaded.add(key);report();}}});map.on("sourcedataabort",event=>{const key=keyOf(event);if(key){requested.add(key);loaded.add(key);report();}});map.on("error",event=>{const key=keyOf(event as unknown as {sourceId?:string;tile?:{tileID?:{key?:string}}});if(key){requested.add(key);loaded.add(key);report();}});map.once("load",()=>{report();const start=performance.now();const poll=()=>{if(revealed)return;if((requested.size>0&&map.areTilesLoaded())||performance.now()-start>10000)finish();else window.setTimeout(poll,100);};poll();const id=new URLSearchParams(location.search).get("project");if(id&&!new URLSearchParams(location.search).get("landmark")&&!new URLSearchParams(location.search).get("poi"))flyToProject(id);});map.on("click",event=>{if((event.originalEvent.target as HTMLElement)?.classList.contains("maplibregl-canvas"))setSelectedPoiId(null);});}} /></div>
    <button className="menu-btn" aria-label={t.menu} aria-expanded={menu} aria-controls="settings-menu" onClick={()=>{setMenu(!menu);setSharing(false);}}><Icon name={menu?"close":"menu"} size={18}/></button>
    {menu&&<div className={`menu-panel ${sharing?"with-sharing":""}`} id="settings-menu" role="menu" onKeyDown={event=>{
      if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
      const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
      const index=items.indexOf(document.activeElement as HTMLButtonElement);
      const next=event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowDown'?1:-1)+items.length)%items.length;
      event.preventDefault();items[next]?.focus();
    }}>
      <Link role="menuitem" href={`/?lang=${lang}`}>{lang==="ar"?"العودة للموقع":"Back to the website"}<span>↗</span></Link>
      <Link role="menuitem" href={`/projects?lang=${lang}`}>{lang==="ar"?"استكشف المشاريع":"Explore the collection"}<span>↗</span></Link>
      <button role="menuitem" onClick={()=>{setTheme(theme==="light"?"dark":"light");setMenu(false);setSharing(false);}}><Icon name={theme==="light"?"moon":"sun"} size={18}/>{theme==="light"?t.darkTheme:t.lightTheme}</button>
      <button role="menuitem" onClick={()=>{setLang(lang==="en"?"ar":"en");setMenu(false);setSharing(false);}}><b className="ar-mark">{lang==="en"?"Ar":"En"}</b>{t.language}</button>
      <button role="menuitem" className={sharing?"is-on":""} aria-expanded={sharing} onClick={()=>setSharing(!sharing)}><Icon name="share" size={18}/>{t.share}</button>
      <button role="menuitem" aria-pressed={fullscreenActive} onClick={fullscreen}><Icon name="fullscreen" size={18}/>{t.fullscreen}</button>
      {sharing&&<div className="share-options" aria-label={t.share}>
        <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" size={18}/></a>
        <a href={`mailto:?body=${encodeURIComponent(shareUrl)}`} aria-label={lang==="ar"?"بريد إلكتروني":"Email"}><Icon name="mail" size={18}/></a>
        <button aria-label={t.copyLink} onClick={copyLink}><Icon name="copy" size={18}/></button>
      </div>}
    </div>}
    <Link className="brand estate-map-brand" href={`/?lang=${lang}`} aria-label={lang==="ar"?"نايل إستيتس — الرئيسية":"Nile Estates — Home"}><Seal /><span className="brand-text"><b>{lang==="ar"?"نايل إستيتس":"NILE ESTATES"}</b><i>{lang==="ar"?"اكتشف مكانك":"FIND YOUR PLACE"}</i></span></Link>
    <Link className="estate-map-return" href={`/?lang=${lang}`}>{lang==="ar"?"العودة للموقع":"Back to the website"} ↗</Link>
    <button className="filter-toggle" aria-label={t.layersTitle} aria-expanded={filters} aria-controls="map-tools" onClick={()=>setFilters(!filters)}><span aria-hidden="true">•••</span></button>
    <nav id="map-tools" className={`tools ${filters?"is-open":""}`} aria-label={t.layersTitle}>{TOOLS.map(x=><button key={x.id} className={`tool ${layers.includes(x.id)?"is-on":""}`} aria-label={t.tools[x.key]} aria-pressed={layers.includes(x.id)} onClick={()=>toggleLayer(x.id)}><Icon name={x.icon} size={20}/><span className="tool-tip">{t.tools[x.key]}</span></button>)}</nav>
    <div className={`bottom ${drawer?"is-open":""}`}><div className="zoom"><button aria-label={t.zoomIn} onClick={()=>zoomBy(1)}><Icon name="plus" size={18}/></button><button aria-label={t.fit} onClick={fitAll}><Icon name="expand" size={18}/></button><button aria-label={t.zoomOut} onClick={()=>zoomBy(-1)}><Icon name="minus" size={18}/></button></div>
      <button className="all" aria-label={t.allProjects} aria-expanded={drawer} aria-controls="project-browser" onClick={()=>setDrawer(open=>!open)}><span aria-hidden={drawer}>{t.allProjects}</span><Icon name="chevronDown" size={16}/></button>
    </div>
    {drawerPresence.value&&<div className={`rail${drawerPresence.exiting?' is-exiting':''}`} aria-hidden={!drawer} aria-label={t.allProjects}>
      <div className="rail-pills" id="rail-pills">
        <ExpandSearch open={searchOpen} value={projectQuery} lang={lang} onChange={setProjectQuery} onOpenChange={open=>{setOpenPill(null);setSearchOpen(open);}}/>
        <div className="rail-pill-wrap">
          <span className={`rail-pill ${areaFilter!=="all"?"is-on":""}`}>
            <button type="button" className="rail-pill-main rail-pill-area" aria-haspopup="listbox" aria-expanded={openPill==="area"} aria-controls="rail-area-menu" onClick={()=>{setSearchOpen(false);setOpenPill(openPill==="area"?null:"area");}}>
              <span className="rail-pill-label">{t.area}</span><b>{areaLabel}</b><Icon name="chevronDown" size={12}/>
            </button>
            {areaFilter!=="all"&&<button type="button" className="rail-pill-x" aria-label={t.clearFilters} onClick={()=>{setAreaFilter("all");setOpenPill(null);}}><Icon name="close" size={10}/></button>}
          </span>
          {openPill==="area"&&<div className="rail-menu" id="rail-area-menu" role="listbox" aria-label={t.area}>
            <button type="button" role="option" aria-selected={areaFilter==="all"} onClick={()=>{setAreaFilter("all");setOpenPill(null);}}><span>{t.allAreas}</span>{areaFilter==="all"&&<Icon name="check" size={13}/>}</button>
            {projectAreas.map(([value,label])=><button key={value} type="button" role="option" aria-selected={areaFilter===value} onClick={()=>{setAreaFilter(value);setOpenPill(null);}}><span>{label}</span>{areaFilter===value&&<Icon name="check" size={13}/>}</button>)}
          </div>}
        </div>
        <div className="rail-pill-wrap">
          <span className={`rail-pill ${statusFilter!=="all"?"is-on":""}`}>
            <button type="button" className="rail-pill-main rail-pill-status" aria-haspopup="listbox" aria-expanded={openPill==="status"} aria-controls="rail-status-menu" onClick={()=>{setSearchOpen(false);setOpenPill(openPill==="status"?null:"status");}}>
              <span className="rail-pill-label">{t.statusLabel}</span><b>{statusLabel}</b><Icon name="chevronDown" size={12}/>
            </button>
            {statusFilter!=="all"&&<button type="button" className="rail-pill-x" aria-label={t.clearFilters} onClick={()=>{setStatusFilter("all");setOpenPill(null);}}><Icon name="close" size={10}/></button>}
          </span>
          {openPill==="status"&&<div className="rail-menu" id="rail-status-menu" role="listbox" aria-label={t.statusLabel}>
            <button type="button" role="option" aria-selected={statusFilter==="all"} onClick={()=>{setStatusFilter("all");setOpenPill(null);}}><span>{t.allStatuses}</span>{statusFilter==="all"&&<Icon name="check" size={13}/>}</button>
            {(Object.keys(t.status) as StatusId[]).map(id=><button key={id} type="button" role="option" aria-selected={statusFilter===id} onClick={()=>{setStatusFilter(id);setOpenPill(null);}}><span>{t.status[id]}</span>{statusFilter===id&&<Icon name="check" size={13}/>}</button>)}
          </div>}
        </div>
      </div>
      <div className="rail-track" id="project-browser" ref={railRef}>
        {filteredProjects.map(p=><button key={p.id} data-id={p.id} className={`rail-card ${p.id===selectedId?"is-on":""}`} aria-pressed={p.id===selectedId} onClick={()=>select(p.id)}><ProjectImage project={p} lang={lang} sizes="(max-width: 900px) calc(100vw - 82px), 246px"/><span className="rail-status">{t.status[p.status]}</span><span className="rail-foot"><b>{p.name[lang]}</b><small><Icon name="pin" size={12}/>{p.area[lang]}</small></span></button>)}
        {!filteredProjects.length&&<p className="rail-empty">{t.noProjects}</p>}
      </div>
    </div>}
    {placeCard.value&&<PlaceCard place={placeCard.value} exiting={placeCard.exiting} isLandmark={retainedLandmark} route={route} lang={lang} onClose={()=>setSelectedPoiId(null)}/>}
    {projectCard.value&&<ProjectCard key={projectCard.value.id} project={projectCard.value} exiting={projectCard.exiting} lang={lang} onClose={()=>select(null)}/>}
    {selected&&selectedPlace&&route.status==="ready"&&<ComparisonConnector key={`${selectedId}:${selectedPoiId}:${lang}`}/>}
    <button className="info" aria-label={t.info} aria-expanded={about} onClick={()=>setAbout(!about)}>i</button>
    {about&&<div className="about" role="dialog" aria-label={t.info}><a href="https://www.esri.com/" target="_blank" rel="noreferrer">{t.dataSource}: Esri</a><button aria-label={t.close} onClick={()=>setAbout(false)}><Icon name="close" size={14}/></button></div>}
    {toast&&<div className="toast" role="status">{toast}</div>}
  </div>;
}
