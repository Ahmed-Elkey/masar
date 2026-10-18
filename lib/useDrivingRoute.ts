import { useEffect,useState } from 'react';
import type { DrivingRoute,RouteState } from './routing';
const routes=new Map<string,DrivingRoute>();
export function useDrivingRoute(projectId:string|null,destinationId:string|null):RouteState {
  const key=projectId&&destinationId?`${projectId}:${destinationId}`:null;
  const [result,setResult]=useState<{key:string;value:RouteState}|null>(null);
  useEffect(()=>{
    if(!key||!projectId||!destinationId)return;
    const cached=routes.get(key);if(cached){setResult({key,value:{status:'ready',data:cached}});return;}
    const controller=new AbortController();
    setResult({key,value:{status:'loading',data:null}});
    fetch(`/api/route?${new URLSearchParams({project:projectId,destination:destinationId})}`,{signal:controller.signal})
      .then(async response=>{if(!response.ok)throw new Error();return response.json() as Promise<DrivingRoute>;})
      .then(data=>{if(controller.signal.aborted)return;routes.set(key,data);setResult({key,value:{status:'ready',data}});})
      .catch(()=>{if(!controller.signal.aborted)setResult({key,value:{status:'error',data:null}});});
    return()=>controller.abort();
  },[key,projectId,destinationId]);
  if(!key)return {status:'idle',data:null};
  return result?.key===key?result.value:{status:'loading',data:null};
}
