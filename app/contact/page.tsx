import type { Metadata } from "next";
import SiteShell from "@/components/estate/SiteShell";
import Contact from "@/components/estate/ContactLayout";
import { c, language } from "@/lib/estate";
export async function generateMetadata({ searchParams: searchParamsPromise }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata>{const searchParams=await searchParamsPromise; return { title: c(language(searchParams), "Find Your Place — Nile Estates", "اكتشف مكانك — نايل إستيتس") }; }
export default async function ContactPage({ searchParams: searchParamsPromise }: { searchParams: Promise<Record<string, string | string[] | undefined>> }){const searchParams=await searchParamsPromise;
  const lang = language(searchParams);
  return <SiteShell lang={lang} lightHeader><Contact lang={lang} initialProject={typeof searchParams.project === "string" ? searchParams.project : undefined} /></SiteShell>;
}
