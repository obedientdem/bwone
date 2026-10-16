import Link from "next/link";
import { ArtImage, PageIntro } from "@/components/editorial";
import { ReviewsExplorer } from "@/components/explorers";
import { Arrow } from "@/components/icons";
import { reviews } from "@/data/demo";
import { localized, text } from "@/i18n";
import { readLocale, type LocalePageProps } from "@/lib/route";

export default async function Page({ params }: LocalePageProps) {
  const locale = await readLocale(params);
  const featured = reviews[0];
  const copy = localized(featured.copy, locale);
  return <><PageIntro locale={locale} eyebrow="THE REVIEW ARCHIVE" title={text(locale, "每一款游戏，都有不止一面。", "Every game has more than one side.")} description={text(locale, "从机制到情绪，从白点到黑点。让一篇认真写下的体验，帮你找到自己的下一款游戏。", "From mechanics to moods, from highlights to reservations. Find your next game through a considered experience.")} index="REVIEWS"/><div className="wrap"><div className="list-feature"><Link href={`/${locale}/reviews/${featured.slug}`} aria-label={copy.value.title}><ArtImage art={featured.art} label={text(locale, "森林冒险原创场景示意", "Original illustrative forest adventure scene")}/></Link><div className="list-feature-copy"><span className="eyebrow">COVER STORY / {featured.game[locale]}</span><h2 lang={copy.language === "zh" ? "zh-CN" : "en"}>{copy.value.title}</h2><p lang={copy.language === "zh" ? "zh-CN" : "en"}>{copy.value.summary}</p><Link className="text-link" href={`/${locale}/reviews/${featured.slug}`}>{text(locale, "阅读本期封面", "Read the cover story")}<Arrow/></Link></div></div><section className="catalog-section"><ReviewsExplorer locale={locale}/></section></div></>;
}
