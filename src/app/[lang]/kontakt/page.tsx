import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Contact from "../../components/Contact";
import Footer from "../../components/Footer";
import { getCachedContactSection } from "@/sanity/cache";

type Props = {
  params: Promise<{ lang: string }>;
};

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
