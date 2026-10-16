import Link from "next/link";
import { ActivitiesExplorer } from "@/components/explorers";
import { ArtImage, PageIntro } from "@/components/editorial";
import { Arrow } from "@/components/icons";
import { activities } from "@/data/demo";
import { text } from "@/i18n";
import { readLocale, type LocalePageProps } from "@/lib/route";

export default async function Page({ params }: LocalePageProps) {
  const locale = await readLocale(params);
  const featured = activities[0];
  return <><PageIntro locale={locale} eyebrow="COME PLAY A PART" title={text(locale, "好游戏，好相遇。", "Good games. Good encounters.")} description={text(locale, "参与一次试玩，发现一款新作，或者把一份游戏礼物带回家。先把规则读清楚，再一起出发。", "Try a playtest, discover a new world or take home a game gift. Clear rules make room for better encounters.")} index="ACTIVITIES"/><div className="wrap"><div className="list-feature"><Link href={`/${locale}/activities/${featured.slug}`} aria-label={featured.title[locale]}><ArtImage art={featured.art} label={text(locale, "森林试玩活动原创场景示意", "Original illustrative forest playtest scene")}/></Link><div className="list-feature-copy"><span className="eyebrow">FEATURED PLAYTEST / {text(locale, "示例专题", "ILLUSTRATIVE FEATURE")}</span><h2>{featured.title[locale]}</h2><p>{featured.summary[locale]}</p><Link className="text-link" href={`/${locale}/activities/${featured.slug}`}>{text(locale, "查看活动说明", "Explore the activity")}<Arrow/></Link></div></div><section className="catalog-section"><ActivitiesExplorer locale={locale}/></section></div></>;
}
