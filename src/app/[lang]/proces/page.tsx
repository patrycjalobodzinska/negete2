import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import ProcessPage from "../../components/ProcessPage";
import Footer from "../../components/Footer";
import { getCachedProcessPage } from "@/sanity/cache";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function ProcessPageRoute({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const processData = await getCachedProcessPage(lang as Language);

  return (
    <main className="relative min-h-screen w-full">
      <ProcessPage lang={lang as Language} initialData={processData} />
      <Footer />
    </main>
  );
}
