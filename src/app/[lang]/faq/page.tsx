import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import { FaqAccordion } from "../../components/FaqAccordion";
import { FaqPageJsonLd } from "../../components/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";
import { getCachedFaqSection, getCachedSiteSettings } from "@/sanity/cache";
import type { FaqItem } from "@/sanity/faq";

export const revalidate = 3600;

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
    title: faqData?.heading ?? t(lang as Language, "faq.title"),
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
  if (!languages.includes(lang as Language)) notFound();

  const faqData = await getCachedFaqSection(lang as Language);

  const items: FaqItem[] = faqData?.items ?? [];
  const heading = faqData?.heading ?? t(lang as Language, "faq.title");
  const subtitle = faqData?.subtitle;

  const faqItemsForSeo = items.map((i) => ({
    question: i.question,
    answer: i.answer,
  }));

  return (
    <main id="main-content" className="relative pt-16 min-h-screen">
      <FaqPageJsonLd items={faqItemsForSeo} lang={lang} url={`/${lang}/faq`} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-6 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-white ">
            {heading}
          </h1>
          {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
        </div>
        {items.length > 0 ? (
          <FaqAccordion items={items} />
        ) : (
          <p className="text-gray-400">
            {t(lang as Language, "faq.noQuestions")}
          </p>
        )}
      </div>
      <Footer />
    </main>
  );
}
