import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "../../components/Footer";
import { getCachedFaqSection, getCachedSiteSettings } from "@/sanity/cache";
import { FaqAccordion } from "../../components/FaqAccordion";
import { FaqPageJsonLd } from "../../components/JsonLd";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const [settings, faqData] = await Promise.all([
    getCachedSiteSettings(lang as Language),
    getCachedFaqSection(lang as Language),
  ]);
  const seo = settings?.faqPageSeo;
  return buildMetadata({
    title: faqData?.heading ?? (lang === "pl" ? "FAQ" : "FAQ"),
    description: faqData?.subtitle,
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/faq`,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const faqData = await getCachedFaqSection(lang as Language);

  return (
    <main className="relative min-h-screen">
      {faqData?.items && faqData.items.length > 0 && (
        <FaqPageJsonLd
          items={faqData.items.map((i) => ({
            question: i.question,
            answer: i.answer,
          }))}
          lang={lang}
        />
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <Link
          href={lang === "pl" ? "/" : `/${lang}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 text-sm font-medium"
        >
          ← {lang === "pl" ? "Strona główna" : "Home"}
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {faqData?.heading ?? (lang === "pl" ? "FAQ" : "FAQ")}
          </h1>
          {faqData?.subtitle && (
            <p className="text-xl text-gray-400 leading-relaxed">
              {faqData.subtitle}
            </p>
          )}
        </header>

        {faqData?.items && faqData.items.length > 0 ? (
          <div className="min-h-[28rem]">
            <FaqAccordion items={faqData.items} />
          </div>
        ) : (
          <p className="text-gray-400">
            {lang === "pl"
              ? "Brak pytań. Dodaj je w Sanity Studio."
              : "No questions yet. Add them in Sanity Studio."}
          </p>
        )}
      </div>
      <Footer />
    </main>
  );
}
