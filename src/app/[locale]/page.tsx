import { Home } from "@/components/home";
import { readLocale, type LocalePageProps } from "@/lib/route";

export default async function Page({ params }: LocalePageProps) {
  return <Home locale={await readLocale(params)}/>;
}
