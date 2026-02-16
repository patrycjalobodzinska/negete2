import { getCachedProjectBySlug } from "@/sanity/cache";
import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/app/components/Footer";
import ProjectGallery from "@/app/components/ProjectGallery";
import ProjectImageGrid from "@/app/components/ProjectImageGrid";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const project = await getCachedProjectBySlug(slug, lang as Language);

  if (!project) {
    notFound();
  }

  // Wyciągnij hero section – obraz osobno, tekst osobno
  const heroSection = project.sections?.find((s: any) => s._type === "heroSection");
  const heroImage = heroSection?.backgroundImage;
  const heroTitle = heroSection?.title || project.title;
  const heroSubtitle = heroSection?.subtitle;
  const otherSections = project.sections?.filter((s: any) => s._type !== "heroSection") || [];

  return (
    <>
      <div className="min-h-screen ">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24">
            {/* Powrót */}
            <Link
              href={`/${lang}/realizacje`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 group text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {lang === "pl" ? "Powrót do realizacji" : "Back to projects"}
            </Link>

            {/* Nagłówek – tytuł i kategoria bez tła */}
            <header className="mb-12">
              {project.categoryLabel && (
                <Badge
                  variant="outline"
                  className="mb-4 bg-transparent border-cyan-500/40 text-cyan-400 text-xs font-medium px-3 py-1"
                >
                  {project.categoryLabel}
                </Badge>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight">
                {heroTitle}
              </h1>
              {heroSubtitle && (
                <p className="mt-4 text-lg text-gray-400 max-w-2xl leading-relaxed">
                  {heroSubtitle}
                </p>
              )}
            </header>

            {/* Główne zdjęcie – osobny blok, bez tekstu na wierzchu */}
            {(heroImage || project.image) && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5 mb-16 bg-black/20">
                <Image
                  src={heroImage?.url || project.image}
                  alt={heroImage?.alt || project.imageAlt || project.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Pozostałe sekcje */}
            <div className="space-y-16">
              {otherSections.map((section: any, index: number) => {
                if (section._type === "descriptionSection") {
                  return (
                    <div key={index}>
                      {section.content && (
                        <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      )}
                    </div>
                  );
                }

                if (section._type === "gallerySection") {
                  return (
                    <ProjectGallery
                      key={index}
                      images={section.images || []}
                      title={section.title}
                    />
                  );
                }

                if (section._type === "specsSection") {
                  return (
                    <section key={index} className="space-y-6">
                      {section.title && (
                        <h2 className="text-xl font-medium text-white">
                          {section.title}
                        </h2>
                      )}
                      {section.specs && section.specs.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {section.specs.map((spec: any, specIndex: number) => (
                            <div
                              key={specIndex}
                              className="flex justify-between items-baseline py-3 border-b border-white/5"
                            >
                              <span className="text-sm text-gray-400">
                                {spec.label}
                              </span>
                              <span className="text-white font-medium">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                }

                if (section._type === "featuresSection") {
                  return (
                    <section key={index} className="space-y-6">
                      {section.title && (
                        <h2 className="text-xl font-medium text-white">
                          {section.title}
                        </h2>
                      )}
                      {section.features && section.features.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {section.features.map((feature: any, featureIndex: number) => (
                            <div
                              key={featureIndex}
                              className="border border-white/5 rounded-xl p-6"
                            >
                              {feature.icon && (
                                <span className="text-2xl mb-3 block">{feature.icon}</span>
                              )}
                              <h3 className="text-white font-medium mb-2">
                                {feature.title}
                              </h3>
                              {feature.description && (
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  {feature.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                }

                if (section._type === "imageGridSection") {
                  return (
                    <ProjectImageGrid
                      key={index}
                      items={section.items || []}
                      title={section.title}
                    />
                  );
                }

                return null;
              })}
            </div>

            {/* Fallback gdy brak sekcji – opis (obraz jest już wyżej) */}
            {(!project.sections || project.sections.length === 0) && project.description && (
              <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </div>
            )}

            {/* Link powrotu na dole */}
            <div className="mt-20 pt-12 border-t border-white/5">
              <Link
                href={`/${lang}/realizacje`}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {lang === "pl" ? "Wszystkie realizacje" : "All projects"}
              </Link>
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
}
