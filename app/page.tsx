import type { Metadata } from "next";
import MapLoader from "@/components/MapLoader";
import { PROJECTS } from "@/lib/data";
import media from "@/lib/media.json";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const MEDIA = media as Record<string, { images: { src: string }[] }>;

const COPY = {
  en: {
    title: "Egypt Investment Map | Nile Estates",
    description:
      "Interactive satellite map of real-estate investment projects across Egypt — New Capital, Sheikh Zayed, 6th of October, New Cairo and the North Coast.",
  },
  ar: {
    title: "خريطة الاستثمار العقاري في مصر | نايل إستيتس",
    description:
      "خريطة تفاعلية بالأقمار الصناعية لمشاريع الاستثمار العقاري في مصر — العاصمة الإدارية، الشيخ زايد، ٦ أكتوبر، القاهرة الجديدة والساحل الشمالي.",
  },
};

export function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): Metadata {
  const copy = searchParams.lang === "ar" ? COPY.ar : COPY.en;
  return { title: copy.title, description: copy.description };
}

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const project = PROJECTS.find(p => p.id === searchParams.project);
  const jsonLd = project
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: project.name.en,
        description: project.description.en,
        url: `${SITE}/?project=${project.id}`,
        image: (MEDIA[project.id]?.images ?? []).slice(0, 3).map(image => new URL(image.src, SITE).toString()),
        address: {
          "@type": "PostalAddress",
          addressLocality: project.area.en,
          addressCountry: "EG",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: project.lat,
          longitude: project.lng,
        },
        provider: {
          "@type": "Organization",
          name: "Nile Estates",
          url: SITE,
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Residential developments in Egypt",
        numberOfItems: PROJECTS.length,
        itemListElement: PROJECTS.map((p, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: p.name.en,
          url: `${SITE}/?project=${p.id}`,
        })),
      };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <MapLoader />
    </>
  );
}
