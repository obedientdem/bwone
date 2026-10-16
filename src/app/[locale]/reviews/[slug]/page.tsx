import { notFound } from "next/navigation";
import { ReviewDetail } from "@/components/detail";
import { reviews } from "@/data/demo";
import { readLocale } from "@/lib/route";

export const dynamicParams = false;
export function generateStaticParams() { return reviews.map(item => ({ slug: item.slug })); }
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const locale = await readLocale(params);
  const { slug } = await params;
  const item = reviews.find(candidate => candidate.slug === slug);
  if (!item) notFound();
  return <ReviewDetail review={item} locale={locale}/>;
}
