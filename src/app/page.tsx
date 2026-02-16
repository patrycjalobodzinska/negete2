import { defaultLanguage } from "@/i18n/config";
import HeroAlt from "./components/HeroAlt";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import TrustedBy from "./components/TrustedBy";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Strona główna bez prefiksu języka (domyślnie polski)
export default async function Home() {
  return (
    <main className="relative min-h-screen">
      <HeroAlt />
      <Services lang={defaultLanguage} />
      <Portfolio lang={defaultLanguage} />
      <Process lang={defaultLanguage} />
      <TrustedBy lang={defaultLanguage} />
      <Contact lang={defaultLanguage} />
      <Footer />
    </main>
  );
}
