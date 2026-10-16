import type { Genre, Platform, Review } from "../data/demo.ts";
import type { Locale, Localized } from "../i18n/index.ts";
import { localized } from "../i18n/index.ts";

export type ReviewFilters = { query?: string; genre?: Genre | "all"; platform?: Platform | "all"; minScore?: number; sort?: "newest" | "score" | "popular" };

export function filterReviews(items: Review[], filters: ReviewFilters = {}) {
  const query = (filters.query ?? "").normalize("NFKC").toLocaleLowerCase().trim();
  const filtered = items.filter(item => {
    const searchable = [item.game.zh, item.game.en, item.copy.zh.title, item.copy.en?.title ?? "", item.copy.zh.summary].join(" ").normalize("NFKC").toLocaleLowerCase();
    return (!query || searchable.includes(query))
      && (!filters.genre || filters.genre === "all" || item.genre === filters.genre)
      && (!filters.platform || filters.platform === "all" || item.platforms.includes(filters.platform))
      && item.score >= (filters.minScore ?? 0);
  });
  return filtered.sort((a, b) => {
    const recent = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    if (filters.sort === "score") return b.score - a.score || recent;
    if (filters.sort === "popular") return b.views30d - a.views30d || recent;
    return recent;
  });
}

export function articleForLocale<T>(article: { id: string; copy: Localized<T> }, locale: Locale) {
  return { id: article.id, ...localized(article.copy, locale) };
}

export function validScore(score: number) {
  return Number.isFinite(score) && score >= 0 && score <= 10 && Number.isInteger(score * 2);
}
