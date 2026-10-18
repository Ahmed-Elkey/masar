"use client";
import { useEffect,useState } from "react";
import type { Lang, Project } from "@/lib/types";
import manifest from "@/lib/media.json";
import variants from "@/lib/imageVariants.json";
import SatelliteThumb from "./SatelliteThumb";
const WIDTHS = variants as Record<string, number[]>;
export function imageVariant(src: string, width: number) {
  return `${src.replace(/\.(webp|jpe?g|png)$/i, "")}-${width}.avif`;
}
export function imageSrcSet(src: string) {
  return (WIDTHS[src] ?? []).map(width => `${imageVariant(src, width)} ${width}w`).join(", ");
}
export function previewSrc(src: string) {
  const widths = WIDTHS[src] ?? [];
  const width = widths.find(w => w >= 960) ?? widths[widths.length - 1];
  return width ? imageVariant(src, width) : src;
}
export interface Media {
  images: {src:string;source:string}[];
  page:string;brochure:string|null;brochureKind?:"site-guide"|"developer"|"published";brochureSource?:string;brochureNote?:{en:string;ar:string};brochurePages?:string[];guide?:string;
  logo?:{src:string;source:string;alt:string;kind:string};projectLogo?:{src:string;source:string;whiteArtwork?:boolean;darkArtwork?:boolean};
}
export function projectMedia(project: Project): Media {
  return (manifest as Record<string, Media>)[project.id] ?? { images: [], page: project.url ?? "", brochure: null };
}
export default function ProjectImage({project, index = 0, eager = false, lang="en", sizes="(max-width: 900px) 100vw, 384px"}: {project: Project; index?: number; eager?: boolean; lang?:Lang; sizes?:string}) {
  const [failed, setFailed] = useState(false);
  const images = projectMedia(project).images;
  const src = images[index % Math.max(images.length, 1)]?.src;
  useEffect(()=>setFailed(false),[src]);
  if (!src || failed) return <SatelliteThumb lat={project.lat} lng={project.lng} zoom={project.heroZoom ?? 16} alt={project.name[lang]} />;
  const srcSet = imageSrcSet(src);
  return <picture className="project-image-picture">
    {srcSet&&<source type="image/avif" srcSet={srcSet} sizes={sizes}/>}
    <img className="project-image" src={src} alt={project.name[lang]} loading={eager ? "eager" : "lazy"} draggable={false} onError={() => setFailed(true)} />
  </picture>;
}
