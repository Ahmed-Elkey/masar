"use client";
import { useEffect,useRef,useState } from 'react';
import type { Lang,Project } from '@/lib/types';
import ProjectImage,{projectMedia} from './ProjectImage';
interface Props {project:Project;lang:Lang;index:number;onMove:(delta:number)=>void;hero?:boolean}
export default function PhotoViewer({project,lang,index,onMove,hero=false}:Props) {
  const count=Math.max(1,projectMedia(project).images.length);
  const root=useRef<HTMLDivElement>(null);
  const pointers=useRef(new Map<number,{x:number;y:number}>());
  const gesture=useRef<{x:number;y:number;panX:number;panY:number}|null>(null);
  const pinch=useRef<{distance:number;zoom:number}|null>(null);
  const timer=useRef<ReturnType<typeof setTimeout>>();
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const [offset,setOffset]=useState(0);
  const [settling,setSettling]=useState(false);
  const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(()=>{
    clearTimeout(timer.current);setOffset(0);setSettling(false);setZoom(1);setPan({x:0,y:0});pointers.current.clear();gesture.current=null;pinch.current=null;
    return()=>clearTimeout(timer.current);
  },[index,project.id]);
  const release=()=>{pointers.current.clear();gesture.current=null;pinch.current=null;};
  const pointDistance=()=>{const [a,b]=Array.from(pointers.current.values());return a&&b?Math.hypot(a.x-b.x,a.y-b.y):0;};
  const clampPan=(x:number,y:number)=>{
    const bounds=root.current?.getBoundingClientRect();if(!bounds)return {x:0,y:0};
    return {x:Math.max(-bounds.width*(zoom-1)/2,Math.min(bounds.width*(zoom-1)/2,x)),y:Math.max(-bounds.height*(zoom-1)/2,Math.min(bounds.height*(zoom-1)/2,y))};
  };
  const settle=(delta:number)=>{
    const size=hero?root.current?.clientWidth:root.current?.clientHeight;
    if(!size)return;
    const duration=reduced()?0:260;
    setSettling(true);setOffset(delta?-delta*size:0);
    timer.current=setTimeout(()=>{if(delta)onMove(delta);setOffset(0);setSettling(false);},duration);
  };
  return <div ref={root} className={`photo-viewer${hero?' is-hero':''}${zoom>1?' is-zoomed':''}${settling?' is-settling':''}`}
    tabIndex={hero?undefined:0} role={hero?undefined:"group"} aria-label={hero?undefined:(lang==='ar'?'صور المشروع؛ اضغط Enter للتكبير':'Project photos; press Enter to zoom')}
    onKeyDown={event=>{
      if(hero)return;
      if(event.key==='Enter'||event.key===' '){event.preventDefault();release();setOffset(0);setZoom(prev=>prev>1?1:3);setPan({x:0,y:0});}
      if(event.key==='Escape'&&zoom>1){event.preventDefault();event.stopPropagation();setZoom(1);setPan({x:0,y:0});}
    }}
    title={!hero?(lang==='ar'?'اسحب لتغيير الصورة، واضغط مرتين للتكبير':'Drag to change photo; double-click to zoom'):undefined}
    onDoubleClick={event=>{if(hero)return;event.preventDefault();release();setOffset(0);setZoom(prev=>prev>1?1:3);setPan({x:0,y:0});}}
    onPointerDown={event=>{
      if(event.button!==0||settling)return;
      event.currentTarget.setPointerCapture(event.pointerId);pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pointers.current.size===2&&!hero){pinch.current={distance:pointDistance(),zoom};gesture.current=null;setOffset(0);}
      else if(pointers.current.size===1)gesture.current={x:event.clientX,y:event.clientY,panX:pan.x,panY:pan.y};
    }}
    onPointerMove={event=>{
      if(!pointers.current.has(event.pointerId))return;
      pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pinch.current&&!hero){const scale=Math.max(1,Math.min(3,pinch.current.zoom*pointDistance()/Math.max(1,pinch.current.distance)));setZoom(scale);setPan({x:0,y:0});return;}
      const start=gesture.current;if(!start)return;
      if(zoom>1){setPan(clampPan(start.panX+event.clientX-start.x,start.panY+event.clientY-start.y));return;}
      if(count>1)setOffset(hero?event.clientX-start.x:event.clientY-start.y);
    }}
    onPointerUp={event=>{
      pointers.current.delete(event.pointerId);
      if(pinch.current){release();return;}
      const start=gesture.current;gesture.current=null;
      if(!start||zoom>1)return;
      const distance=hero?event.clientX-start.x:event.clientY-start.y;
      if(count>1&&Math.abs(distance)>45)settle(distance<0?1:-1);else if(offset)settle(0);
    }}
    onPointerCancel={()=>{release();if(offset)settle(0);}}
    onDragStart={event=>event.preventDefault()}>
    <div className="photo-track" style={{transform:hero?`translateX(calc(-100% + ${offset}px))`:`translateY(calc(-100% + ${offset}px))`}}>
      {[-1,0,1].map(delta=><div className="photo-frame" key={delta} aria-hidden={delta!==0}>
        <div className="photo-transform" style={delta===0?{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}:undefined}>
          <ProjectImage project={project} lang={lang} index={(index+delta+count)%count} eager={delta===0} sizes={hero?"(max-width: 900px) 100vw, 384px":"100vw"}/>
        </div>
      </div>)}
    </div>
  </div>;
}
