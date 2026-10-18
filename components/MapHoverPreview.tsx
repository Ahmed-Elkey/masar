"use client";
import type {Landmark,Lang,Poi,Project} from '@/lib/types';
import {STRINGS} from '@/lib/i18n';
import {placeMedia} from '@/lib/placeMedia';
import {Icon} from './Icon';
import ProjectImage from './ProjectImage';
import PlacePhoto from './PlacePhoto';
export default function MapHoverPreview({project,place,isLandmark=false,lang}:{project?:Project;place?:Landmark|Poi;isLandmark?:boolean;lang:Lang}) {
  const entity=project||place;if(!entity)return null;
  const photo=place&&placeMedia(place.id,isLandmark);
  return <aside className="map-hover-preview" dir={lang==='ar'?'rtl':'ltr'} role="tooltip" id="map-hover-preview">
    {project?<ProjectImage project={project} lang={lang} eager sizes="(max-width: 900px) 280px, 333px"/>:place&&<PlacePhoto place={place} isLandmark={isLandmark} lang={lang}/>}
    {project&&<span className="hover-status">{STRINGS[lang].status[project.status]}</span>}
    <div className="hover-preview-copy"><strong>{entity.name[lang]}</strong>
      <span><Icon name="pin" size={13}/>{project?project.area[lang]:place&&'area' in place?place.area[lang]:lang==='ar'?'مصر':'Egypt'}</span>
      {place&&photo?.kind==='aerial'&&<small>{lang==='ar'?'صورة جوية للموقع':'Aerial view of location'} · Esri</small>}
      {place&&photo&&photo.kind!=='aerial'&&<small>{photo.author.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&')} · {photo.license}</small>}
    </div>
  </aside>;
}
