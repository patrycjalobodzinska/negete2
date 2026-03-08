import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Footer from "../../../components/Footer";
import { Button } from "../../../components/ui/button";
import {
  getCachedServicesSection,
  getCachedServiceCtaSection,
  getCachedSiteSettings,
} from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";
import LucideDynamicIcon from "@/components/LucideDynamicIcon";
import { ServiceJsonLd } from "../../../components/JsonLd";
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
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.description,
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/uslugi/${slug}`,
    seo: service.seo,
    image: settings?.defaultOgImage,
  });
}

export default async function UslugaDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const [servicesData, serviceCtaData] = await Promise.all([
    getCachedServicesSection(lang as Language),
    getCachedServiceCtaSection(lang as Language),
  ]);

  const service = servicesData?.services?.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const title = service.title;
  const description = service.description;
  const iconKey = service.iconKey || "Cpu";
  const longDescription = service.longDescription;
  const features = service.features ?? [];
  const processSteps = service.process ?? [];
  const specs = service.specs ?? [];

  const otherServices =
    servicesData?.services
      ?.filter((s) => s.slug && s.slug !== slug)
      .slice(0, 3)
      .map((s) => ({ iconKey: s.iconKey || "Cpu", title: s.title, slug: s.slug! })) ?? [];

  return (
    <main id="main-content" className="relative min-h-screen">
      <ServiceJsonLd
        name={title}
        description={description}
        url={`/${lang}/uslugi/${slug}`}
        lang={lang}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <Link
          href={`/${lang}/uslugi`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 text-sm font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t(lang as Language, "common.allServices")}
        </Link>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/20">
              <LucideDynamicIcon iconKey={iconKey} className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
            {description}
          </p>
        </header>

        {longDescription && (
          <section className="mb-16">
            <div className="border-l-4 border-cyan-400/40 pl-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                {longDescription}
              </p>
            </div>
          </section>
        )}

        {features.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              {t(lang as Language, "uslugiDetail.whatWeOffer")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {processSteps.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              {t(lang as Language, "uslugiDetail.howWeWork")}
            </h2>
            <div className="space-y-4">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-5 p-5 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                    <span className="text-cyan-400 text-sm font-bold">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">{step.step}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {specs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              {t(lang as Language, "uslugiDetail.technicalSpecs")}
            </h2>
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              {specs.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center px-6 py-4 ${
                    idx !== specs.length - 1 ? "border-b border-white/5" : ""
                  }`}>
                  <span className="text-gray-400 text-sm">{spec.label}</span>
                  <span className="text-white font-medium text-sm">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              {serviceCtaData?.title ??
                t(lang as Language, "uslugiDetail.ctaTitle")}
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              {serviceCtaData?.description ??
                t(lang as Language, "uslugiDetail.ctaDescription")}
            </p>
            <Button variant="cta" size="lg" asChild>
              <Link
                href={`/${lang}/${(serviceCtaData?.link || "/kontakt").replace(/^\//, "")}`}>
                {serviceCtaData?.buttonText ??
                  t(lang as Language, "uslugiDetail.ctaButton")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {otherServices.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              {t(lang as Language, "uslugiDetail.otherServices")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherServices.map((related, idx) => (
                <Link
                  key={idx}
                  href={`/${lang}/uslugi/${related.slug}`}
                  className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="p-2.5 rounded-lg bg-white/10 w-fit mb-3 group-hover:bg-cyan-500/10 transition-colors">
                    <LucideDynamicIcon iconKey={related.iconKey} className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-20 pt-12 border-t border-white/5">
          <Link
            href={`/${lang}/uslugi`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            {t(lang as Language, "common.allServices")}
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
