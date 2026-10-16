import { notFound } from "next/navigation";
import { LegalPage, legalPages } from "@/components/info-pages";
import { readLocale } from "@/lib/route";
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(legalPages).map(slug => ({ slug })); }
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const locale = await readLocale(params);
  const { slug } = await params;
  if (!(slug in legalPages)) notFound();
  return <LegalPage slug={slug as keyof typeof legalPages} locale={locale}/>;
}
