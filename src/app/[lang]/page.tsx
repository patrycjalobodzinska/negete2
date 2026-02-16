import { defaultLanguage, type Language, languages } from "@/i18n/config";
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
} from "@/sanity/cache";

type Props = {
  params: Promise<{ lang: string }>;
};

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
