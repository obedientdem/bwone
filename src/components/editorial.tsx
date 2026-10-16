import { sitePath } from "@/lib/site-path";
import Link from "next/link";
import { genres, newsCategories, type Art, type Review, type News, type Activity } from "@/data/demo";
import { articleForLocale } from "@/lib/catalog";
import { text, formatDate, type Locale } from "@/i18n";
import { Arrow } from "./icons";

const positions: Record<Art, [number, number]> = { forest: [0, 0], stairs: [-836, 0], tram: [0, -470.5], coast: [-836, -470.5] };
export function ArtImage({ art, className = "", label, children }: { art: Art; className?: string; label: string; children?: React.ReactNode }) {
  const [x, y] = positions[art];
  return <div className={`game-art art-${art} ${className}`}><svg className="art-image" viewBox="0 0 836 470.5" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}><image href={sitePath("/images/imagined-worlds.png")} width="1672" height="941" x={x} y={y}/></svg>{children}<span className="art-disclaimer">CONCEPT / SAMPLE</span></div>;
}

export function SectionHeading({ locale, index, title, subtitle, href, dark = false }: { locale: Locale; index: string; title: string; subtitle: string; href?: string; dark?: boolean }) {
  return <div className={`section-heading ${dark ? "on-dark" : ""}`}><div className="section-heading-copy"><span className="section-number">{index}</span><div><span className="eyebrow">{subtitle}</span><h2>{title}</h2></div></div>{href && <Link className="text-link" href={href}>{text(locale, "查看全部", "View all")}<Arrow/></Link>}</div>;
}

export function Score({ value, locale, large = false }: { value: number; locale: Locale; large?: boolean }) {
  return <div className={`score ${large ? "score-large" : ""}`} aria-label={text(locale, `官方示例评分 ${value} 分，满分 10 分`, `Illustrative editorial score ${value} out of 10`)}><strong>{value.toFixed(1)}</strong><span>{text(locale, "官方示例评分", "EDITORIAL / SAMPLE")}</span></div>;
}

export function ReviewCard({ review, locale }: { review: Review; locale: Locale }) {
  const article = articleForLocale(review, locale);
  return <article className="review-card"><Link href={`/${locale}/reviews/${review.slug}`} className="card-art-link" aria-label={`${review.game[locale]} — ${article.value.title}`}><ArtImage art={review.art} label={text(locale, `${review.game[locale]} 原创场景示意图`, `Original concept scene for ${review.game[locale]}`)}><span className="small-score">{review.score.toFixed(1)}<span>/ 10</span></span></ArtImage></Link><div className="card-meta"><span>{genres[review.genre][locale]} / {review.platforms.join(" · ")}</span><span>{text(locale, "示例测评", "SAMPLE REVIEW")}</span></div><span className="game-name">{review.game[locale]}</span><h3 lang={article.language === "zh" ? "zh-CN" : "en"}><Link href={`/${locale}/reviews/${review.slug}`}>{article.value.title}</Link></h3><p lang={article.language === "zh" ? "zh-CN" : "en"}>{article.value.summary}</p><div className="card-bottom"><span>{formatDate(review.publishedAt, locale)}</span><span>{review.minutes} {text(locale, "分钟阅读", "min read")} <Arrow/></span></div></article>;
}

export function NewsCard({ item, locale, compact = false }: { item: News; locale: Locale; compact?: boolean }) {
  const article = articleForLocale(item, locale);
  return <article className={`news-card ${compact ? "news-compact" : ""}`}><Link href={`/${locale}/news/${item.slug}`} className="card-art-link" aria-label={article.value.title}><ArtImage art={item.art} label={text(locale, "原创资讯示意图", "Original illustrative news artwork")}/></Link><div className="news-card-copy"><div className="card-meta"><span>{newsCategories[item.category][locale]}</span><time dateTime={item.publishedAt}>{formatDate(item.publishedAt, locale)}</time></div><h3 lang={article.language === "zh" ? "zh-CN" : "en"}><Link href={`/${locale}/news/${item.slug}`}>{article.value.title}</Link></h3><p lang={article.language === "zh" ? "zh-CN" : "en"}>{article.value.summary}</p><Link className="text-link" href={`/${locale}/news/${item.slug}`}>{text(locale, "阅读资讯", "Read the story")}<Arrow/></Link></div></article>;
}

export function statusLabel(status: Activity["status"], locale: Locale) {
  const labels = { open: ["进行中", "Open"], upcoming: ["即将开始", "Coming soon"], closed: ["已结束", "Closed"], drawn: ["已开奖", "Results available"] };
  return labels[status][locale === "zh" ? 0 : 1];
}

export function ActivityCard({ activity, locale }: { activity: Activity; locale: Locale }) {
  return <article className="activity-card"><Link className="card-art-link" href={`/${locale}/activities/${activity.slug}`} aria-label={activity.title[locale]}><ArtImage art={activity.art} label={text(locale, "原创活动示意图", "Original illustrative activity artwork")}><span className="activity-kind">{activity.kind === "recruitment" ? text(locale, "测试招募", "PLAYTEST") : text(locale, "游戏抽奖", "GIVEAWAY")}</span></ArtImage></Link><div className="activity-copy"><div className="card-meta"><span className={`activity-status status-${activity.status}`}>{statusLabel(activity.status, locale)} · {text(locale, "示例", "Sample")}</span><span>{activity.places} {activity.kind === "recruitment" ? text(locale, "个体验名额", "playtest places") : text(locale, "份游戏礼物", "game gifts")}</span></div><h3><Link href={`/${locale}/activities/${activity.slug}`}>{activity.title[locale]}</Link></h3><p>{activity.summary[locale]}</p><div className="card-bottom"><span>{text(locale, "截止", "Closes")} {formatDate(activity.endsAt, locale)}</span><Link aria-label={text(locale, `查看${activity.title[locale]}`, `View ${activity.title[locale]}`)} href={`/${locale}/activities/${activity.slug}`}><Arrow/></Link></div></div></article>;
}

export function PageIntro({ locale, eyebrow, title, description, index }: { locale: Locale; eyebrow: string; title: string; description: string; index: string }) {
  return <div className="page-intro wrap"><div className="intro-rule"><span className="eyebrow">{eyebrow}</span><span className="edition-label">{text(locale, "黑白测评组", "BLACKWHITE")} / {index}</span></div><h1>{title}</h1><p>{description}</p></div>;
}

export function LanguageFallback({ locale, fallback }: { locale: Locale; fallback: boolean }) {
  return fallback ? <p className="content-notice" role="note">{text(locale, "该语言稿尚未提供，以下显示原文，界面语言保持不变。", "An English edition is not available. The original Chinese text is shown below; your interface language is unchanged.")}</p> : null;
}
