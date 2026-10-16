import { SearchResults } from "@/components/explorers";
import { PageIntro } from "@/components/editorial";
import { text } from "@/i18n";
import { readLocale, type LocalePageProps } from "@/lib/route";
export default async function Page({ params }: LocalePageProps) {
  const locale = await readLocale(params);
  return <><PageIntro locale={locale} eyebrow="FIND ANOTHER SIDE" title={text(locale, "从一个关键词开始。", "Start with a little curiosity.")} description={text(locale, "在示例测评、资讯与活动中搜索你感兴趣的内容。", "Search the sample reviews, news and activities.")} index="SEARCH"/><section className="wrap catalog-section"><SearchResults locale={locale}/></section></>;
}
