import {
  getCachedPublishedBlogPosts,
  getCachedPublishedBlogCount,
  getCachedSiteSettings,
} from "@/sanity/cache";
import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../components/Footer";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const settings = await getCachedSiteSettings(lang as Language);
  const seo = settings?.blogListPageSeo;
  return buildMetadata({
    title: lang === "pl" ? "Blog" : "Blog",
    description:
      lang === "pl"
        ? "Artykuły i przemyślenia o technologii i projektowaniu"
        : "Articles and insights on technology and design",
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/blog`,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const [posts, count] = await Promise.all([
    getCachedPublishedBlogPosts(lang as Language),
    getCachedPublishedBlogCount(),
  ]);

  if (count === 0) {
    return (
      <main className="relative min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-3xl sm:text-4xl font-medium text-white mb-4">
            {lang === "pl" ? "Blog" : "Blog"}
          </h1>
          <p className="text-gray-400 text-xl">
            {lang === "pl"
              ? "Wkrótce dostępne artykuły"
              : "Articles coming soon"}
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl font-medium text-white mb-6 leading-tight">
            {lang === "pl" ? "Blog" : "Blog"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
            {lang === "pl"
              ? "Artykuły i przemyślenia o technologii i projektowaniu"
              : "Articles and insights on technology and design"}
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/${lang}/blog/${post.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1"
              >
                {post.mainImage ? (
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={post.mainImage}
                      alt={post.mainImageAlt || post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="aspect-video bg-white/5 flex items-center justify-center">
                    <span className="text-4xl text-gray-500">📝</span>
                  </div>
                )}
                <div className="p-6">
                  <time className="text-xs text-gray-500 block mb-2">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString(
                          lang === "pl" ? "pl-PL" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
                  </time>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              {lang === "pl"
                ? "Brak opublikowanych artykułów"
                : "No published articles yet"}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
