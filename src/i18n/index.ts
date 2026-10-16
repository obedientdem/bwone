export const locales = ["zh", "en"] as const;
export type Locale = typeof locales[number];
export type Bilingual<T> = Record<Locale, T>;
export type Localized<T> = { zh: T; en?: T };

export function isLocale(value: string): value is Locale {
  return value === "zh" || value === "en";
}

export function text(locale: Locale, zh: string, en: string) {
  return locale === "zh" ? zh : en;
}

export function localized<T>(content: Localized<T>, locale: Locale): { value: T; language: Locale; fallback: boolean } {
  if (locale === "en" && content.en !== undefined) return { value: content.en, language: "en", fallback: false };
  return { value: content.zh, language: "zh", fallback: locale !== "zh" };
}

export const nav = [
  { path: "", zh: "首页", en: "Home" },
  { path: "/reviews", zh: "游戏测评", en: "Reviews" },
  { path: "/news", zh: "游戏资讯", en: "News" },
  { path: "/activities", zh: "活动中心", en: "Activities" },
  { path: "/about", zh: "关于我们", en: "About" },
  { path: "/business", zh: "商务合作", en: "Work with us" }
] as const;

export function formatDate(value: string, locale: Locale, withTime = false) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-GB", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "short", day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {})
  }).format(new Date(value));
}
