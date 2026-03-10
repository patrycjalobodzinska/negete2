import { defaultLanguage } from "@/i18n/config";
import HeroAlt from "./components/HeroAlt";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Stats from "./components/Stats";
import TrustedBy from "./components/TrustedBy";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import {
  getCachedSiteSettings,
  getCachedPortfolioSection,
  getCachedStatsSection,
} from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";

/** ISR – cache 1h na Vercel */
export const revalidate = 3600;

export async function generateMetadata() {
  try {
    const settings = await getCachedSiteSettings(defaultLanguage);
    const seo = settings?.homePageSeo;
    return buildMetadata({
      title: "Strona główna",
      description: "Twój zewnętrzny dział R&D – od pomysłu do produktu",
      siteName: settings?.siteName,
      lang: "pl",
      path: "/",
      seo,
      image: settings?.defaultOgImage,
    });
  } catch (error) {
    console.error("[v0] Error generating metadata:", error);
    return buildMetadata({
      title: "Strona główna",
      description: "Twój zewnętrzny dział R&D – od pomysłu do produktu",
      lang: "pl",
      path: "/",
    });
  }
}
export default async function Home() {
  let portfolioData = null;
  let statsData = null;
  
  try {
    [portfolioData, statsData] = await Promise.all([
      getCachedPortfolioSection(defaultLanguage),
      getCachedStatsSection(defaultLanguage),
    ]);
  } catch (error) {
    console.error("[v0] Error fetching homepage data:", error);
  }
  
  return (
    <main id="main-content" className="relative min-h-screen">
      <HeroAlt />
      <Stats lang={defaultLanguage} initialData={statsData} />
      <Services lang={defaultLanguage} />
      <Portfolio lang={defaultLanguage} initialData={portfolioData} />
      <Process lang={defaultLanguage} />
      <TrustedBy lang={defaultLanguage} />
      <Contact lang={defaultLanguage} />
      <Footer />
    </main>
  );
}
