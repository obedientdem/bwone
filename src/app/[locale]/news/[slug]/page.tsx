import { notFound } from "next/navigation";
import { NewsDetail } from "@/components/detail";
import { news } from "@/data/demo";
import { readLocale } from "@/lib/route";

export const dynamicParams = false;
export function generateStaticParams() { return news.map(item => ({ slug: item.slug })); }
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const locale = await readLocale(params);
  const { slug } = await params;
  const item = news.find(candidate => candidate.slug === slug);
  if (!item) notFound();
  return <NewsDetail item={item} locale={locale}/>;
}
