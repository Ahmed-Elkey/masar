"use client";
import { useLayoutEffect,useState } from 'react';
interface Position {left:number;top:number;height:number;reverse:boolean}
/** Connects the project card to the place's location icon without intercepting input. */
export default function ComparisonConnector() {
  const [position,setPosition]=useState<Position|null>(null);
  useLayoutEffect(()=>{
    const project=document.querySelector<HTMLElement>('.card');
    const place=document.querySelector<HTMLElement>('.landmark-detail');
    const pin=place?.querySelector<SVGElement>('.route-summary > svg:first-of-type');
    if(!project||!place||!pin)return;
    let frame=0;const started=performance.now();
    const measure=()=>{
      const a=project.getBoundingClientRect(),b=place.getBoundingClientRect(),p=pin.getBoundingClientRect();
      const reverse=b.top<a.top;
      const top=reverse?b.bottom-4:a.bottom-6;
      const bottom=reverse?a.top+4:p.top+1;
      const next={left:p.left+p.width/2-2,top,height:Math.max(0,bottom-top),reverse};
      setPosition(prev=>prev&&Object.keys(next).every(key=>Math.abs(Number(prev[key as keyof Position])-Number(next[key as keyof Position]))<.5)?prev:next);
    };
    const settle=()=>{measure();if(performance.now()-started<450)frame=requestAnimationFrame(settle);};
    settle();
    const observer=new ResizeObserver(measure);observer.observe(project);observer.observe(place);observer.observe(pin);
    window.addEventListener('resize',measure);place.addEventListener('scroll',measure,true);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',measure);place.removeEventListener('scroll',measure,true);};
  },[]);
  if(!position||position.height<2)return null;
  const count=Math.ceil(position.height/12)+1;
  return <div className={`comparison-connector${position.reverse?' is-reversed':''}`} aria-hidden="true" style={{left:position.left,top:position.top,height:position.height}}>
    {Array.from({length:count},(_,i)=><i key={i}/>)}
  </div>;
}
