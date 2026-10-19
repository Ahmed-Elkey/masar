import type { Metadata } from "next";
import SiteShell from "@/components/estate/SiteShell";
import Contact from "@/components/estate/ContactLayout";
import { c, language } from "@/lib/estate";
export function generateMetadata({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }): Metadata { return { title: c(language(searchParams), "Find Your Place — Nile Estates", "اكتشف مكانك — نايل إستيتس") }; }
export default function ContactPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const lang = language(searchParams);
  return <SiteShell lang={lang} lightHeader><Contact lang={lang} initialProject={typeof searchParams.project === "string" ? searchParams.project : undefined} /></SiteShell>;
}
