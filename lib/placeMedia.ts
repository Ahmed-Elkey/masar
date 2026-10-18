import landmarks from './landmarkMedia.json';
import services from './poiMedia.json';
export interface PlaceMedia {src:string;page:string;author:string;license:string;licenseUrl?:string;kind?:'photo'|'aerial'}
export function placeMedia(id:string,isLandmark=false):PlaceMedia|undefined {
  return ((isLandmark?landmarks:services) as Record<string,PlaceMedia>)[id];
}
