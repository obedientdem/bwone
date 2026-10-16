import { AccountPreview } from "@/components/info-pages";
import { readLocale, type LocalePageProps } from "@/lib/route";
export default async function Page({ params }: LocalePageProps) { return <AccountPreview locale={await readLocale(params)}/>; }
