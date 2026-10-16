import Link from "next/link";
import { ArtImage, PageIntro } from "@/components/editorial";
import { NewsExplorer } from "@/components/explorers";
import { Arrow } from "@/components/icons";
import { news } from "@/data/demo";
import { localized, text } from "@/i18n";
import { readLocale, type LocalePageProps } from "@/lib/route";

export default async function Page({ params }: LocalePageProps) {
  const locale = await readLocale(params);
  const copy = localized(news[0].copy, locale);
  return <><PageIntro locale={locale} eyebrow="NOTES FROM THE GAME WORLD" title={text(locale, "故事，在游戏内外继续。", "The stories continue, in and beyond the game.")} description={text(locale, "关注新作、版本与创作的变化。把消息讲清楚，也把值得讨论的细节留下来。", "New games, updates and shifts in the creative world. Clear reporting, with room for the details worth discussing.")} index="NEWS"/><div className="wrap"><div className="list-feature"><Link href={`/${locale}/news/${news[0].slug}`} aria-label={copy.value.title}><ArtImage art={news[0].art} label={text(locale, "原创头条配图示意", "Original illustrative headline artwork")}/></Link><div className="list-feature-copy"><span className="eyebrow">THE LEAD STORY / {text(locale, "示例", "SAMPLE")}</span><h2>{copy.value.title}</h2><p>{copy.value.summary}</p><Link className="text-link" href={`/${locale}/news/${news[0].slug}`}>{text(locale, "阅读头条", "Read the lead story")}<Arrow/></Link></div></div><section className="catalog-section"><NewsExplorer locale={locale}/></section></div></>;
}
