import type { Metadata } from "next";
import SiteShell from "@/components/estate/SiteShell";
import Contact from "@/components/estate/ContactLayout";
import { language } from "@/lib/estate";
export const metadata: Metadata = { title: "Find Your Place — Nile Estates" };
export default function ContactPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const lang = language(searchParams);
  return <SiteShell lang={lang} lightHeader><Contact lang={lang} initialProject={typeof searchParams.project === "string" ? searchParams.project : undefined} /></SiteShell>;
}
