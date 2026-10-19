import type { Lang } from "./types";
import { PROJECTS } from "./data";

export const language = (params: Record<string, string | string[] | undefined>): Lang => params.lang === "ar" ? "ar" : "en";
export function siteHref(path: string, lang: Lang) { return `${path}${path.includes("?") ? "&" : "?"}lang=${lang}`; }
export function c(lang: Lang, en: string, ar: string) { return lang === "ar" ? ar : en; }
export const FEATURED = ["mivida", "fouka-bay", "ivoire-west"].map(id => PROJECTS.find(p => p.id === id)!);
export const DESTINATIONS = [
  { area: "New Cairo", en: "New Cairo", ar: "القاهرة الجديدة", id: "mivida", caption: "A new rhythm", captionAr: "إيقاع جديد للحياة" },
  { area: "North Coast", en: "North Coast", ar: "الساحل الشمالي", id: "fouka-bay", caption: "By the sea", captionAr: "على شاطئ البحر" },
  { area: "Sheikh Zayed", en: "Sheikh Zayed", ar: "الشيخ زايد", id: "ivoire-west", caption: "Room to breathe", captionAr: "مساحة للحياة" },
  { area: "New Capital", en: "New Capital", ar: "العاصمة الإدارية", id: "il-bosco", caption: "Looking ahead", captionAr: "نحو آفاق جديدة" },
  { area: "6th October", en: "6th of October", ar: "٦ أكتوبر", id: "garden-lakes", caption: "A greener everyday", captionAr: "حياة تحيطها الخضرة" },
];
