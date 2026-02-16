import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Contact from "../../components/Contact";
import Footer from "../../components/Footer";
import { getCachedContactSection, getCachedSiteSettings } from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const [settings, contactData] = await Promise.all([
    getCachedSiteSettings(lang as Language),
    getCachedContactSection(lang as Language),
  ]);
  const seo = settings?.contactPageSeo;
  return buildMetadata({
    title: contactData?.heading ?? (lang === "pl" ? "Kontakt" : "Contact"),
    description: contactData?.subtitle,
    siteName: settings?.siteName,
    lang,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const contactData = await getCachedContactSection(lang as Language);

  return (
    <main className="relative min-h-screen">
      <Contact lang={lang as Language} initialData={contactData} />
      <Footer />
    </main>
  );
}
