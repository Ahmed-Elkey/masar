import { useId } from "react";

export function Blossom({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
    {Array.from({ length: 8 }, (_, i) => <path key={i} d="M50 46C36 35 40 23 50 12C60 23 64 35 50 46Z" fill="currentColor" transform={`rotate(${i * 45} 50 50)`} />)}
    <circle cx="50" cy="50" r="5" fill="currentColor" />
  </svg>;
}

export function Seal({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return <span className={`estate-seal ${className}`}>
    <svg className="seal-ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id={id} d="M60,10 a50,50 0 1,1 -.01,0" /></defs><text><textPath href={`#${id}`} textLength="309">NILE ESTATES · EGYPT · NILE ESTATES · EGYPT · </textPath></text></svg>
    <Blossom />
  </span>;
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d={diagonal ? "M7 25 25 7M7 7h18v18" : "M3 16h25M19 7l9 9-9 9"} stroke="currentColor" strokeWidth="1.2" /></svg>;
}
