import Link from "next/link";
import SiteShell, { EditorialLink } from "@/components/estate/SiteShell";

export default function NotFound() {
  return <SiteShell lang="en" lightHeader><section className="collection-intro">
    <span className="eyebrow">404 · This address is not on the map</span>
    <h1 className="display">Lost<em>in the city</em></h1>
    <p>The page you were looking for does not exist. Every project on Nile Estates is one click away from here.</p>
    <div className="not-found-links">
      <EditorialLink href="/projects">View the collection</EditorialLink>
      <EditorialLink href="/map">Explore the map</EditorialLink>
      <EditorialLink href="/">Back home</EditorialLink>
    </div>
    <div className="estate-arabic not-found-arabic" dir="rtl">
      <span className="eyebrow">٤٠٤ · العنوان ده مش على الخريطة</span>
      <p>الصفحة اللي بتدور عليها مش موجودة. كل المشاريع على نايل إستيتس موجودة هنا.</p>
      <div className="not-found-links">
        <Link className="editorial-link" href="/projects?lang=ar">استكشف المشاريع</Link>
        <Link className="editorial-link" href="/map?lang=ar">استكشف الخريطة</Link>
        <Link className="editorial-link" href="/?lang=ar">العودة للرئيسية</Link>
      </div>
    </div>
  </section></SiteShell>;
}
