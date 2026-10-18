"use client";
import {useEffect,useState} from 'react';
import type {Landmark,Lang,Poi} from '@/lib/types';
import {placeMedia} from '@/lib/placeMedia';
import SatelliteThumb from './SatelliteThumb';
export default function PlacePhoto({place,isLandmark=false,lang}:{place:Landmark|Poi;isLandmark?:boolean;lang:Lang}) {
  const photo=placeMedia(place.id,isLandmark);
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[photo?.src]);
  return <div className="place-photo-background" aria-hidden="true">
    {photo&&!failed?<img className="landmark-photo" src={photo.src} alt="" onError={()=>setFailed(true)}/>:<SatelliteThumb lat={place.lat} lng={place.lng} zoom={17} alt={place.name[lang]}/>}
  </div>;
}
