import type { Lang } from './types';
export interface DrivingRoute {
  distance: number;
  duration: number;
  geometry: {type:'LineString';coordinates:[number,number][]};
}
export type RouteState = {status:'idle'|'loading'|'error';data:null} | {status:'ready';data:DrivingRoute};
export function routeLabels(route:DrivingRoute,lang:Lang) {
  const distance = new Intl.NumberFormat(lang==='ar'?'ar-EG':'en',{maximumFractionDigits:1}).format(route.distance/1000);
  const number=(value:number)=>new Intl.NumberFormat(lang==='ar'?'ar-EG':'en').format(value);
  const mins = Math.max(1,Math.round(route.duration/60));
  const time = mins<60 ? `${new Intl.NumberFormat(lang==='ar'?'ar-EG':'en').format(mins)} ${lang==='ar'?'دقيقة':'min'}` : `${number(Math.floor(mins/60))} ${lang==='ar'?'ساعة':'h'} ${mins%60?`${number(mins%60)} ${lang==='ar'?'دقيقة':'min'}`:''}`.trim();
  return {distance:`${distance} ${lang==='ar'?'كم':'km'}`,time};
}

/** Distances along the line keep drawing speed and badge placement consistent. */
export function routeDistances(coordinates:[number,number][]) {
  const cumulative=[0];
  for(let i=1;i<coordinates.length;i++) {
    const [x,y]=coordinates[i-1],[nx,ny]=coordinates[i];
    const radians=Math.PI/180;
    const h=Math.sin((ny-y)*radians/2)**2+Math.cos(y*radians)*Math.cos(ny*radians)*Math.sin((nx-x)*radians/2)**2;
    cumulative.push(cumulative[i-1]+12742000*Math.asin(Math.sqrt(Math.min(1,h))));
  }
  return cumulative;
}
export function pointOnRoute(coordinates:[number,number][],cumulative:number[],progress:number) {
  const distance=cumulative[cumulative.length-1]*Math.max(0,Math.min(1,progress));
  let index=1;
  while(index<cumulative.length-1&&cumulative[index]<distance)index++;
  const length=cumulative[index]-cumulative[index-1];
  const fraction=length?(distance-cumulative[index-1])/length:0;
  const a=coordinates[index-1],b=coordinates[index];
  return {index,coordinate:[a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction] as [number,number]};
}
