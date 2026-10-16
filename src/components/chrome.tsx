"use client";

import { sitePath } from "@/lib/site-path";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { nav, text, type Locale } from "@/i18n";
import { Arrow, CloseIcon, SearchIcon } from "./icons";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const other = locale === "zh" ? "en" : "zh";
  const languageHref = pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${other}`);
  return <>
    <div className="preview-strip"><div className="wrap"><span className="preview-dot" />{text(locale, "预览样刊 · 文章、评分与活动均为示例；当前不接受报名或提交资料。", "Preview edition · Articles, scores and activities are illustrative. No applications or personal data are collected.")}</div></div>
    <header className="site-header"><div className="wrap header-main">
      <Link href={`/${locale}`} className="brand" aria-label={text(locale, "黑白测评组首页", "Blackwhite home")}><span className="brand-cn">黑白<span className="brand-punctuation">.</span></span><span className="brand-en">BLACKWHITE<br/>GAME JOURNAL</span></Link>
      <nav className="desktop-nav" aria-label={text(locale, "主导航", "Main navigation")}>{nav.map(item => <Link href={`/${locale}${item.path}`} key={item.path} aria-current={pathname === `/${locale}${item.path}` || (item.path && pathname.startsWith(`/${locale}${item.path}/`)) ? "page" : undefined}>{item[locale]}</Link>)}</nav>
      <div className="header-actions"><Link href={languageHref} hrefLang={other} className="language-switch" aria-label={text(locale, "切换到英文，保留当前页面", "Switch to Chinese and keep this page")}>{locale === "zh" ? "EN" : "中文"}</Link><Link href={`/${locale}/account`} className="account-link">{text(locale, "登录 / 个人中心", "Sign in / Account")}<Arrow/></Link></div>
      <details className="mobile-menu"><summary aria-label={text(locale, "展开导航", "Open navigation")}><span/><span/></summary><nav aria-label={text(locale, "移动端导航", "Mobile navigation")}>{nav.map(item => <Link href={`/${locale}${item.path}`} key={item.path}>{item[locale]}</Link>)}<Link href={`/${locale}/account`}>{text(locale, "登录 / 个人中心", "Sign in / Account")}</Link></nav></details>
    </div><div className="wrap header-bottom"><span className="edition-label">INDEPENDENT VOICES. DIFFERENT SIDES.</span><form action={sitePath(`/${locale}/search/`)} role="search" className="header-search"><label className="sr-only" htmlFor="site-search">{text(locale, "搜索游戏、测评或资讯", "Search games, reviews or news")}</label><input id="site-search" type="search" name="q" placeholder={text(locale, "搜一款游戏，发现另一面", "Find a game. Discover another side.")} maxLength={120}/><button aria-label={text(locale, "搜索", "Search")} type="submit"><SearchIcon/></button></form></div></header>
  </>;
}

export function Footer({ locale }: { locale: Locale }) {
  const links = [
    ["terms", "用户协议", "Terms"], ["privacy", "隐私政策", "Privacy"], ["rules", "活动规则", "Activity rules"],
    ["copyright", "版权投诉", "Copyright enquiries"], ["contact", "联系我们", "Contact"]
  ];
  return <footer className="site-footer"><div className="wrap"><div className="footer-main"><div><Link className="footer-wordmark" href={`/${locale}`}>黑白.</Link><p>{text(locale, "看见亮点，也看见另一面。", "The highlights. And the other side.")}</p></div><div className="footer-nav">{nav.slice(1).map(item => <Link key={item.path} href={`/${locale}${item.path}`}>{item[locale]}</Link>)}</div><div className="footer-signoff"><span>PLAY WITH CURIOSITY.</span><span>WRITE WITH INTEGRITY.</span><Link className="text-link" href={`/${locale}/business`}>{text(locale, "让好游戏被看见", "Let good games be seen")}<Arrow/></Link></div></div><div className="footer-bottom"><span>© 2026 BLACKWHITE · {text(locale, "预览样刊", "Preview edition")}</span><nav aria-label={text(locale, "法律与联系信息", "Legal and contact information")}>{links.map(([slug, zh, en]) => <Link key={slug} href={`/${locale}/legal/${slug}`}>{text(locale, zh, en)}</Link>)}</nav><span>{text(locale, "品牌字标暂用 · 配图为原创示意", "Provisional wordmark · Original illustrative artwork")}</span></div></div></footer>;
}

export function ServiceNotice({ locale, children, className = "button" }: { locale: Locale; children: React.ReactNode; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <><button className={className} onClick={() => dialog.current?.showModal()} type="button">{children}</button><dialog ref={dialog} className="service-dialog" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="dialog-top"><span className="eyebrow">BLACKWHITE / PREVIEW</span><button className="icon-button" aria-label={text(locale, "关闭", "Close")} onClick={() => dialog.current?.close()}><CloseIcon/></button></div><h2>{text(locale, "先读一读，更多连接即将开放。", "Keep exploring. More ways to connect are on the way.")}</h2><p>{text(locale, "当前为预览样刊，账号、报名和商务提交尚未开放。这里不会创建账号、记录报名或保存提交资料。", "This preview does not offer accounts, applications or business submissions. It does not create accounts, record entries or save submitted personal data.")}</p><button className="button button-dark" onClick={() => dialog.current?.close()}>{text(locale, "继续浏览", "Keep reading")}<Arrow/></button></dialog></>;
}
