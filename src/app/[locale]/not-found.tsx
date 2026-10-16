"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { text, type Locale } from "@/i18n";
export default function NotFound() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "zh";
  return <section className="not-found wrap"><span className="eyebrow">A PAGE STILL UNWRITTEN</span><h1>404</h1><p>{text(locale, "这一页还没有写下。换一条路，继续探索吧。", "This page is still unwritten. Take another path and keep exploring.")}</p><Link className="button button-dark" href={`/${locale}`}>{text(locale, "返回首页", "Back to the journal")}</Link></section>;
}
