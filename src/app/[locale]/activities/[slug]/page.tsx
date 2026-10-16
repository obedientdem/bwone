import { notFound } from "next/navigation";
import { ActivityDetail } from "@/components/detail";
import { activities } from "@/data/demo";
import { readLocale } from "@/lib/route";

export const dynamicParams = false;
export function generateStaticParams() { return activities.map(item => ({ slug: item.slug })); }
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const locale = await readLocale(params);
  const { slug } = await params;
  const activity = activities.find(candidate => candidate.slug === slug);
  if (!activity) notFound();
  return <ActivityDetail activity={activity} locale={locale}/>;
}
