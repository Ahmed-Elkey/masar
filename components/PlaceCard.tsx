import type { Lang,Landmark,Poi } from '@/lib/types';
import type { RouteState } from '@/lib/routing';
import { LANDMARK_DESCRIPTIONS } from '@/lib/landmarkDescriptions';
import {placeMedia} from '@/lib/placeMedia';
import PlacePhoto from './PlacePhoto';
import { Icon } from './Icon';
import RouteSummary from './RouteSummary';
export default function PlaceCard({place,isLandmark,route,lang,onClose,exiting=false}:{place:Landmark|Poi;isLandmark:boolean;route:RouteState;lang:Lang;onClose:()=>void;exiting?:boolean}) {
  const photo=placeMedia(place.id,isLandmark);
  const author=photo?.author.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&');
  return <aside ref={node => { node?.toggleAttribute("inert", exiting); }} className={`landmark-detail has-photo${exiting?' is-exiting':''}`} aria-label={place.name[lang]} key={`${isLandmark?'landmark':'poi'}:${place.id}`}>
    <PlacePhoto place={place} isLandmark={isLandmark} lang={lang}/>
    <div className="place-content">
      <RouteSummary route={route} lang={lang}/>
      <button className="landmark-close" aria-label={lang==='ar'?'إغلاق المكان':'Close place'} onClick={onClose}><Icon name="close" size={18}/></button>
      <h3>{place.name[lang]}</h3>
      <p>{isLandmark?LANDMARK_DESCRIPTIONS[place.id]?.[lang]:(place as Poi).area[lang]}</p>
      {photo&&<a className="photo-credit" href={photo.page} target="_blank" rel="noreferrer" title={`${author} · ${photo.license}`}>{photo.kind==='aerial'?(lang==='ar'?'صورة جوية للموقع · ':'Aerial view of location · '):''}{author} · {photo.license}</a>}
    </div>
  </aside>;
}
