import { Business } from "@/components/info-pages";
import { readLocale, type LocalePageProps } from "@/lib/route";
export default async function Page({ params }: LocalePageProps) { return <Business locale={await readLocale(params)}/>; }
