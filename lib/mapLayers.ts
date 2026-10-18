import type { LayerSpecification } from "maplibre-gl";
export const ROAD_LAYER_IDS = ["street-casing", "street-lines", "street-names"];
const roads = ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary", "tertiary", "minor", "service"], true, false];
export function roadLayers(): LayerSpecification[] {
  return [
    {id:"street-casing",type:"line",source:"streets","source-layer":"transportation",minzoom:5,filter:roads,layout:{visibility:"none","line-cap":"round","line-join":"round"},paint:{"line-color":"#263d3b","line-opacity":.6,"line-width":["interpolate",["linear"],["zoom"],8,1.5,12,4,16,8]}},
    {id:"street-lines",type:"line",source:"streets","source-layer":"transportation",minzoom:5,filter:roads,layout:{visibility:"none","line-cap":"round","line-join":"round"},paint:{"line-color":["match",["get","class"],["motorway","trunk"],"#ead665",["primary","secondary"],"#8fd477","#78b6c0"],"line-opacity":["interpolate",["linear"],["zoom"],8,.65,12,.95],"line-width":["interpolate",["linear"],["zoom"],8,.65,12,2.2,16,5]}},
    {id:"street-names",type:"symbol",source:"streets","source-layer":"transportation_name",minzoom:8,filter:["match",["get","class"],["motorway","trunk","primary","secondary","tertiary"],true,false],layout:{visibility:"none","symbol-placement":"line","symbol-spacing":300,"text-field":["coalesce",["get","name:latin"],["get","name_en"],["get","ref"],""],"text-font":["Noto Sans Regular"],"text-size":["interpolate",["linear"],["zoom"],11,10,15,13],"text-padding":4},paint:{"text-color":"#ffffff","text-halo-color":"#243239","text-halo-width":1.1}},
  ] as LayerSpecification[];
}
