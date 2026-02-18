import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "../../../components/Footer";
import { getCachedServicesSection, getCachedSiteSettings } from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (!languages.includes(lang as Language)) return {};
  const [settings, servicesData] = await Promise.all([
    getCachedSiteSettings(lang as Language),
    getCachedServicesSection(lang as Language),
  ]);
  const service = servicesData?.services?.find((s) => s.slug === slug);
  const title = service?.title || slug;
  return buildMetadata({
    title,
    description: service?.description,
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/uslugi/${slug}`,
  });
}

export default async function UslugaDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const servicesData = await getCachedServicesSection(lang as Language);
  const service = servicesData?.services?.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="relative min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <Link
          href={`/${lang}/uslugi`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang as Language, "common.allServices")}
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            {service.description}
          </p>
        </header>

        {/* Mock content – docelowo sekcje z Sanity */}
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-gray-300 leading-relaxed">
            {lang === "pl"
              ? "Tu pojawi się pełna treść usługi z Sanity (sekcje, opisy, obrazy). Na razie mock."
              : "Full service content from Sanity (sections, descriptions, images) will appear here. Mock for now."}
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
