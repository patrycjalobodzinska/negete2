import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "../../components/Footer";
import { getCachedFaqSection } from "@/sanity/cache";
import { FaqAccordion } from "../../components/FaqAccordion";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const faqData = await getCachedFaqSection(lang as Language);

  return (
    <main className="relative min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
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
          <FaqAccordion items={faqData.items} />
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
