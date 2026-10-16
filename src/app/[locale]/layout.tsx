import { sitePath } from "@/lib/site-path";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import { text } from "@/i18n";
import { readLocale, type LocalePageProps } from "@/lib/route";
import "@/styles/globals.css";

export const dynamicParams = false;
export function generateStaticParams() { return [{ locale: "zh" }, { locale: "en" }]; }

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const locale = await readLocale(params);
  return {
    title: text(locale, "黑白测评组 · 预览样刊", "Blackwhite · Preview edition"),
    description: text(locale, "黑白独立游戏杂志：认真体验，自由表达。当前文章、评分与活动均为示例。", "An independent game journal. Thoughtful play, honest words. Current articles, scores and activities are illustrative."),
    robots: { index: false, follow: false },
    other: { "color-scheme": "light" }
  };
}

export default async function Layout({ children, params }: LocalePageProps & { children: React.ReactNode }) {
  const locale = await readLocale(params);
  return <html lang={locale === "zh" ? "zh-CN" : "en"}><head><link rel="preload" as="image" href={sitePath("/images/imagined-worlds.png")}/></head><body><a className="skip-link" href="#main-content">{text(locale, "跳到主要内容", "Skip to main content")}</a><Header locale={locale}/><main id="main-content">{children}</main><Footer locale={locale}/></body></html>;
}
