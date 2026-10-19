"use client";
import { useEffect,useRef,useState } from "react";
import type { Lang, Project } from "@/lib/types";
import manifest from "@/lib/media.json";
import variants from "@/lib/imageVariants.json";
import dimensions from "@/lib/imageDimensions.json";
import SatelliteThumb from "./SatelliteThumb";
const WIDTHS = variants as Record<string, number[]>;
const DIMENSIONS = dimensions as Record<string, {width:number;height:number}>;
export function imageVariant(src: string, width: number) {
  return `${src.replace(/\.(webp|jpe?g|png)$/i, "")}-${width}.avif`;
}
export function imageSrcSet(src: string) {
  const candidates = (WIDTHS[src] ?? []).map(width => `${imageVariant(src, width)} ${width}w`);
  if (DIMENSIONS[src]) candidates.push(`${src} ${DIMENSIONS[src].width}w`);
  return candidates.join(", ");
}
export function previewSrc(src: string) {
  const widths = WIDTHS[src] ?? [];
  const width = widths.find(w => w >= 960);
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
  const picture = useRef<HTMLPictureElement>(null);
  const [displayWidth, setDisplayWidth] = useState<number>();
  const images = projectMedia(project).images;
  const src = images[index % Math.max(images.length, 1)]?.src;
  useEffect(()=>setFailed(false),[src]);
  useEffect(() => {
    const element = picture.current, intrinsic = src ? DIMENSIONS[src] : undefined;
    if (!element || !intrinsic) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      // object-fit:cover may need more source pixels than the visible frame width.
      const needed = Math.ceil(Math.max(rect.width, rect.height * intrinsic.width / intrinsic.height));
      if (needed > 0) setDisplayWidth(previous => previous === needed ? previous : needed);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element); measure();
    return () => observer.disconnect();
  }, [src, failed]);
  if (!src || failed) return <SatelliteThumb lat={project.lat} lng={project.lng} zoom={project.heroZoom ?? 16} alt={project.name[lang]} />;
  const srcSet = imageSrcSet(src);
  return <picture className="project-image-picture" ref={picture}>
    <img className="project-image" src={src} srcSet={srcSet || undefined} sizes={displayWidth ? `${displayWidth}px` : sizes} width={DIMENSIONS[src]?.width} height={DIMENSIONS[src]?.height} decoding="async" alt={project.name[lang]} loading={eager ? "eager" : "lazy"} draggable={false} onError={() => setFailed(true)} />
  </picture>;
}
