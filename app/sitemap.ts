import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  return [
    {
      url: `${SITE}/`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { en: `${SITE}/`, ar: `${SITE}/?lang=ar` } },
    },
    ...["projects", "map", "about", "contact", "data", "updates"].map(path => ({ url: `${SITE}/${path}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...PROJECTS.map(project => ({
      url: `${SITE}/projects/${project.id}`,
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
