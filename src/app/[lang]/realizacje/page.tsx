import { getCachedAllProjects, getCachedSiteSettings } from "@/sanity/cache";
import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../../components/ui/badge";
import Footer from "../../components/Footer";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const settings = await getCachedSiteSettings(lang as Language);
  const seo = settings?.realizacjeListPageSeo;
  return buildMetadata({
    title: lang === "pl" ? "Wszystkie realizacje" : "All Projects",
    description:
      lang === "pl"
        ? "Przeglądaj nasze projekty i realizacje"
        : "Browse our projects and implementations",
    siteName: settings?.siteName,
    lang,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const searchParamsResolved = await searchParams;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const selectedCategory = searchParamsResolved.category;
  const projects = await getCachedAllProjects(lang as Language);

  // Pobierz unikalne kategorie
  const categories = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean))
  ).sort();

  // Filtruj projekty po kategorii
  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects;

  return (
    <>
      <div className="min-h-screen ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-26 md:py-36">
            <div className="mb-12 lg:mb-16">
              <h1 className="text-3xl sm:text-4xl font-medium text-white mb-6 leading-tight">
                {lang === "pl" ? "Wszystkie realizacje" : "All Projects"}
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
                {lang === "pl"
                  ? "Przeglądaj nasze projekty i realizacje"
                  : "Browse our projects and implementations"}
              </p>
            </div>

            {/* Filtry kategorii */}
            {categories.length > 0 && (
              <div className="mb-10 lg:mb-12 flex flex-wrap gap-3">
                <Link
                  href={`/${lang}/realizacje`}
                  className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/60 text-cyan-400 shadow-lg shadow-cyan-500/20"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                  }`}>
                  {lang === "pl" ? "Wszystkie" : "All"}
                </Link>
                {categories.map((category) => {
                  const categoryLabel = projects.find((p) => p.category === category)?.categoryLabel || category;
                  return (
                    <Link
                      key={category}
                      href={`/${lang}/realizacje?category=${encodeURIComponent(category || "")}`}
                      className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/60 text-cyan-400 shadow-lg shadow-cyan-500/20"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                      }`}>
                      {categoryLabel}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Lista projektów */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProjects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/${lang}/realizacje/${project.slug}`}
                    className="group relative overflow-hidden rounded-2xl lg:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {project.categoryLabel && (
                        <div className="absolute top-4 left-4 z-10">
                          <Badge
                            variant="outline"
                            className="bg-black/70 backdrop-blur-md border-cyan-400/60 text-cyan-400 text-xs font-medium px-3 py-1 shadow-lg">
                            {project.categoryLabel}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-6 lg:p-8">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-400 text-sm lg:text-base line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 lg:py-32">
                <p className="text-gray-400 text-xl lg:text-2xl">
                  {lang === "pl"
                    ? "Brak projektów w tej kategorii"
                    : "No projects in this category"}
                </p>
              </div>
            )}
          </div>
        </div>
      <Footer />
    </>
  );
}
