import React from "react";
import { getCachedBlogPostBySlug, getCachedSiteSettings } from "@/sanity/cache";
import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "../../../components/Footer";
import type { BlogPostSection } from "@/sanity/blog";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (!languages.includes(lang as Language)) return {};
  const [post, settings] = await Promise.all([
    getCachedBlogPostBySlug(slug, lang as Language),
    getCachedSiteSettings(lang as Language),
  ]);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.mainImage,
    siteName: settings?.siteName,
    lang,
    seo: post.seo,
  });
}

function BlogSection({ section }: { section: BlogPostSection }) {
  if (section._type === "paragraphSection" && section.content) {
    return (
      <p className="text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-line">
        {String(section.content)}
      </p>
    );
  }
  if (section._type === "headingSection" && section.text) {
    const Tag: React.ElementType = section.level === "h3" ? "h3" : "h2";
    return (
      <Tag className="text-2xl font-bold text-white mt-12 mb-4">
        {String(section.text)}
      </Tag>
    );
  }
  if (section._type === "imageSection" && section.image) {
    return (
      <figure className="my-8">
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={String(section.image)}
            alt={String(section.alt || "")}
            fill
            className="object-contain"
          />
        </div>
        {typeof section.caption === "string" && section.caption ? (
          <figcaption className="text-gray-500 text-sm mt-2 text-center">
            {section.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }
  if (section._type === "quoteSection" && section.quote) {
    return (
      <blockquote className="border-l-4 border-cyan-500/60 pl-6 py-4 my-8 italic text-gray-300">
        <p className="text-xl">„{String(section.quote)}"</p>
        {typeof section.author === "string" && section.author ? (
          <cite className="block mt-2 text-cyan-400 not-italic">
            — {section.author}
          </cite>
        ) : null}
      </blockquote>
    );
  }
  if (section._type === "listSection" && Array.isArray(section.items)) {
    return (
      <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
        {section.items.map((item, i) => (
          <li key={i}>{String(item)}</li>
        ))}
      </ul>
    );
  }
  if (section._type === "calloutSection" && section.text) {
    const variantClasses: Record<string, string> = {
      info: "bg-cyan-500/10 border-cyan-400/30",
      success: "bg-green-500/10 border-green-400/30",
      warning: "bg-amber-500/10 border-amber-400/30",
    };
    const cls = variantClasses[String(section.variant)] || variantClasses.info;
    return (
      <div
        className={`rounded-xl border p-6 my-6 ${cls}`}
      >
        <p className="text-gray-200">{String(section.text)}</p>
      </div>
    );
  }
  return null;
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const post = await getCachedBlogPostBySlug(slug, lang as Language);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8 text-sm font-medium"
        >
          ← {lang === "pl" ? "Powrót do bloga" : "Back to blog"}
        </Link>

        <article>
          <header className="mb-12">
            <time className="text-sm text-gray-500 block mb-4">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(
                    lang === "pl" ? "pl-PL" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )
                : ""}
            </time>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-gray-400 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {post.mainImage && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 border border-white/10">
              <Image
                src={post.mainImage}
                alt={post.mainImageAlt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose-content">
            {post.sections.map((section, i) => (
              <BlogSection key={i} section={section} />
            ))}
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-white/10">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            ← {lang === "pl" ? "Wszystkie artykuły" : "All articles"}
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
