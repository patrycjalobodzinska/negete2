import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import HeroAlt from "../components/HeroAlt";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import Process from "../components/Process";
import TrustedBy from "../components/TrustedBy";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import {
  getCachedServicesSection,
  getCachedPortfolioSection,
  getCachedHomepageProcess,
  getCachedTrustedBy,
  getCachedContactSection,
  getCachedSiteSettings,
} from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const settings = await getCachedSiteSettings(lang as Language);
  const seo = settings?.homePageSeo;
  return buildMetadata({
    title: lang === "pl" ? "Strona główna" : "Home",
    description:
      lang === "pl"
        ? "Twój zewnętrzny dział R&D – od pomysłu do produktu"
        : "Your external R&D department – from idea to product",
    siteName: settings?.siteName,
    lang,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const [servicesData, portfolioData, processData, trustedByData, contactData] =
    await Promise.all([
      getCachedServicesSection(lang as Language),
      getCachedPortfolioSection(lang as Language),
      getCachedHomepageProcess(lang as Language),
      getCachedTrustedBy(lang as Language),
      getCachedContactSection(lang as Language),
    ]);

  return (
    <main className="relative min-h-screen">
      <HeroAlt />
      <Services lang={lang as Language} initialData={servicesData} />
      <Portfolio lang={lang as Language} initialData={portfolioData} />
      <Process lang={lang as Language} initialData={processData} />
      <TrustedBy lang={lang as Language} initialData={trustedByData} />
      <Contact lang={lang as Language} initialData={contactData} />
      <Footer />
    </main>
  );
}
