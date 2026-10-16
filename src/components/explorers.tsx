"use client";

import { sitePath } from "@/lib/site-path";

import { useEffect, useState } from "react";
import { activities, genres, news, newsCategories, reviews, type Genre, type Platform } from "@/data/demo";
import { filterReviews, type ReviewFilters } from "@/lib/catalog";
import { text, type Locale } from "@/i18n";
import { ActivityCard, NewsCard, ReviewCard } from "./editorial";
import { SearchIcon } from "./icons";

export function ReviewsExplorer({ locale, searchMode = false }: { locale: Locale; searchMode?: boolean }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<Genre | "all">("all");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<ReviewFilters["sort"]>("newest");
  useEffect(() => { if (searchMode) setQuery(new URLSearchParams(window.location.search).get("q")?.slice(0, 120) ?? ""); }, [searchMode]);
  const filtered = filterReviews(reviews, { query, genre, platform, minScore, sort });
  const reset = () => { setQuery(""); setGenre("all"); setPlatform("all"); setMinScore(0); setSort("newest"); };
  return <div><div className="filter-toolbar"><div className="catalog-search"><label className="sr-only" htmlFor="review-query">{text(locale, "搜索测评", "Search reviews")}</label><SearchIcon/><input id="review-query" type="search" placeholder={text(locale, "游戏名、标题或关键词", "Game, headline or keyword")} value={query} onChange={event => setQuery(event.target.value)} maxLength={120}/></div><div className="select-filters"><label>{text(locale, "类型", "Genre")}<select value={genre} onChange={event => setGenre(event.target.value as Genre | "all")}><option value="all">{text(locale, "全部类型", "All genres")}</option>{Object.entries(genres).map(([value, label]) => <option value={value} key={value}>{label[locale]}</option>)}</select></label><label>{text(locale, "平台", "Platform")}<select value={platform} onChange={event => setPlatform(event.target.value as Platform | "all")}><option value="all">{text(locale, "全部平台", "All platforms")}</option>{["PC", "Switch", "PlayStation"].map(value => <option key={value}>{value}</option>)}</select></label><label>{text(locale, "官方评分", "Editorial score")}<select value={minScore} onChange={event => setMinScore(Number(event.target.value))}><option value={0}>{text(locale, "不限", "Any score")}</option><option value={8}>8.0+</option><option value={8.5}>8.5+</option><option value={9}>9.0+</option></select></label></div></div><div className="results-line"><span role="status" aria-live="polite">{text(locale, `${filtered.length} 篇示例测评`, `${filtered.length} sample reviews`)}</span><label>{text(locale, "排序", "Sort")}<select value={sort} onChange={event => setSort(event.target.value as ReviewFilters["sort"])}><option value="newest">{text(locale, "最新发布", "Newest first")}</option><option value="popular">{text(locale, "近30天热门", "Popular · last 30 days")}</option><option value="score">{text(locale, "官方高分优先", "Highest editorial score")}</option></select></label></div>{filtered.length ? <div className="review-grid">{filtered.map(review => <ReviewCard key={review.id} review={review} locale={locale}/>)}</div> : <div className="empty-state"><span>0 / 0</span><h2>{text(locale, "这一次，还没遇见。", "Nothing here just yet.")}</h2><p>{text(locale, "试试其他关键词，或放宽一下筛选条件。", "Try another keyword or a broader set of filters.")}</p><button className="button button-dark" onClick={reset}>{text(locale, "清除筛选", "Clear filters")}</button></div>}</div>;
}

export function NewsExplorer({ locale }: { locale: Locale }) {
  const [category, setCategory] = useState("all");
  const filtered = news.filter(item => category === "all" || item.category === category);
  return <div><div className="category-tabs" role="group" aria-label={text(locale, "资讯分类", "News categories")}><button aria-pressed={category === "all"} onClick={() => setCategory("all")}>{text(locale, "全部资讯", "All stories")}</button>{Object.entries(newsCategories).map(([key, value]) => <button key={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{value[locale]}</button>)}</div><div className="news-list">{filtered.map(item => <NewsCard key={item.id} item={item} locale={locale}/>)}</div></div>;
}

export function ActivitiesExplorer({ locale }: { locale: Locale }) {
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const filtered = activities.filter(item => (kind === "all" || item.kind === kind) && (status === "all" || item.status === status));
  return <div><div className="activities-controls"><div className="category-tabs" role="group" aria-label={text(locale, "活动类型", "Activity type")}>{[["all", "全部活动", "All activities"], ["recruitment", "测试招募", "Playtests"], ["giveaway", "游戏抽奖", "Giveaways"]].map(([value, zh, en]) => <button key={value} aria-pressed={kind === value} onClick={() => setKind(value)}>{text(locale, zh, en)}</button>)}</div><label className="activity-status-filter">{text(locale, "状态", "Status")}<select value={status} onChange={event => setStatus(event.target.value)}>{[["all", "全部状态", "All states"], ["open", "进行中", "Open"], ["upcoming", "即将开始", "Coming soon"], ["drawn", "已开奖", "Results available"]].map(([value, zh, en]) => <option key={value} value={value}>{text(locale, zh, en)}</option>)}</select></label></div><p className="filter-count" role="status" aria-live="polite">{text(locale, `${filtered.length} 场示例活动 · 样刊时间 2026.10.16`, `${filtered.length} illustrative activities · Edition date 16 Oct 2026`)}</p>{filtered.length ? <div className="activity-grid">{filtered.map(activity => <ActivityCard key={activity.id} activity={activity} locale={locale}/>)}</div> : <div className="empty-state"><h2>{text(locale, "这个分区暂时安静。", "A quiet corner for now.")}</h2><button className="button" onClick={() => { setKind("all"); setStatus("all"); }}>{text(locale, "查看全部活动", "See all activities")}</button></div>}</div>;
}

export function SearchResults({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  useEffect(() => { setQuery(new URLSearchParams(window.location.search).get("q")?.slice(0, 120) ?? ""); }, []);
  const normalized = query.normalize("NFKC").trim().toLocaleLowerCase();
  const foundReviews = normalized ? filterReviews(reviews, { query }) : [];
  const foundNews = normalized ? news.filter(item => [item.copy.zh.title, item.copy.zh.summary, item.copy.en?.title, item.copy.en?.summary].join(" ").normalize("NFKC").toLocaleLowerCase().includes(normalized)) : [];
  const foundActivities = normalized ? activities.filter(item => [...Object.values(item.title), ...Object.values(item.summary)].join(" ").normalize("NFKC").toLocaleLowerCase().includes(normalized)) : [];
  const count = foundReviews.length + foundNews.length + foundActivities.length;
  return <><form className="full-search" action={sitePath(`/${locale}/search/`)}><label className="sr-only" htmlFor="full-search-query">{text(locale, "全站搜索", "Search this journal")}</label><input id="full-search-query" name="q" value={query} onChange={event => setQuery(event.target.value)} placeholder={text(locale, "试试“森间来信”或“探索”", "Try “Woods” or “demo”")} maxLength={120}/><button className="button button-dark" type="submit"><SearchIcon/>{text(locale, "搜索", "Search")}</button></form><p className="results-line" role="status" aria-live="polite">{normalized ? text(locale, `找到 ${count} 条示例内容`, `${count} sample results`) : text(locale, "输入关键词，寻找你感兴趣的另一面。", "Enter a keyword and discover another side.")}</p>{foundReviews.length > 0 && <section className="search-section"><h2>{text(locale, "游戏测评", "Reviews")}</h2><div className="review-grid">{foundReviews.map(item => <ReviewCard key={item.id} review={item} locale={locale}/>)}</div></section>}{foundNews.length > 0 && <section className="search-section"><h2>{text(locale, "游戏资讯", "News")}</h2><div className="news-list">{foundNews.map(item => <NewsCard key={item.id} item={item} locale={locale}/>)}</div></section>}{foundActivities.length > 0 && <section className="search-section"><h2>{text(locale, "活动中心", "Activities")}</h2><div className="activity-grid">{foundActivities.map(item => <ActivityCard key={item.id} activity={item} locale={locale}/>)}</div></section>}{normalized && !count && <div className="empty-state"><h2>{text(locale, "还没有找到这个故事。", "That story has yet to find us.")}</h2><p>{text(locale, "试试游戏名或更短的关键词。", "Try a game title or a shorter keyword.")}</p></div>}</>;
}
