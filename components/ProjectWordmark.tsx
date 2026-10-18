"use client";
import { useEffect,useState } from "react";
import type { Lang, Project } from "@/lib/types";
import { projectMedia } from "./ProjectImage";
export default function ProjectWordmark({project,lang,variant="map"}:{project:Project;lang:Lang;variant?:"map"|"hero"|"details"}) {
  const media=projectMedia(project),logo=media.projectLogo??media.logo;
  const developer=!media.projectLogo;
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[logo?.src]);
  return <span className={`project-wordmark wordmark-${variant}${logo&&!failed?" has-image":""}${developer?' with-developer-mark':''}${!developer&&(media.projectLogo?.whiteArtwork||project.id==='scene-7')?" white-artwork":""}${media.projectLogo?.darkArtwork?' dark-artwork':''}`}>
    {logo&&!failed&&<img src={logo.src} alt={developer?project.developer:project.name[lang]} onError={()=>setFailed(true)}/>}
    {(developer||!logo||failed)&&<b>{project.name[lang]}</b>}
  </span>;
}
