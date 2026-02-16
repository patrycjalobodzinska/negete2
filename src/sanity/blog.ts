import { sanityClient } from "./client";
import type { Language } from "@/i18n/config";
import { urlFor } from "./image";

export interface BlogPostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: string;
  mainImageAlt?: string;
  publishedAt: string;
}

export interface BlogPostSection {
  _type: string;
  [key: string]: unknown;
}

export interface BlogPostDetail {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: string;
  mainImageAlt?: string;
  publishedAt: string;
  sections: BlogPostSection[];
}

/** Liczba opublikowanych artykułów. Pusty publishedAt = widoczny od razu. */
export async function fetchPublishedBlogCount(): Promise<number> {
  const query = `count(*[_type == "blogPost" && (!defined(publishedAt) || publishedAt <= now())])`;
  const count = await sanityClient.fetch<number>(query);
  return count ?? 0;
}

/** Lista opublikowanych artykułów */
export async function fetchPublishedBlogPosts(
  lang: Language = "pl"
): Promise<BlogPostListItem[]> {
  const query = `
    *[_type == "blogPost" && (!defined(publishedAt) || publishedAt <= now())] | order(publishedAt desc) {
      _id,
      titlePl,
      titleEn,
      slug,
      excerptPl,
      excerptEn,
      mainImage{ ..., altPl, altEn },
      publishedAt
    }
  `;
  const data = await sanityClient.fetch<any[]>(query);
  if (!data || data.length === 0) return [];

  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const excerptKey = lang === "pl" ? "excerptPl" : "excerptEn";
  const altKey = lang === "pl" ? "altPl" : "altEn";

  return data.map((item) => ({
    _id: item._id,
    title: item[titleKey] || item.titlePl || "",
    slug: item.slug?.current || "",
    excerpt: item[excerptKey] || item.excerptPl || "",
    mainImage: item.mainImage
      ? urlFor(item.mainImage).width(800).height(450).fit("clip").url()
      : undefined,
    mainImageAlt: item.mainImage?.[altKey] || item.mainImage?.altPl || "",
    publishedAt: item.publishedAt || "",
  }));
}

/** Pojedynczy artykuł po slug */
export async function fetchBlogPostBySlug(
  slug: string,
  lang: Language = "pl"
): Promise<BlogPostDetail | null> {
  const query = `
    *[_type == "blogPost" && slug.current == $slug && (!defined(publishedAt) || publishedAt <= now())][0]{
      _id,
      titlePl,
      titleEn,
      slug,
      excerptPl,
      excerptEn,
      mainImage{ ..., altPl, altEn },
      publishedAt,
      sections[]
    }
  `;
  const data = await sanityClient.fetch<any | null>(query, { slug });
  if (!data) return null;

  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const excerptKey = lang === "pl" ? "excerptPl" : "excerptEn";
  const altKey = lang === "pl" ? "altPl" : "altEn";

  const mapSection = (section: any): BlogPostSection => {
    const mapped: BlogPostSection = { _type: section._type };
    if (section._type === "paragraphSection") {
      mapped.content =
        section[lang === "pl" ? "contentPl" : "contentEn"] || section.contentPl;
    } else if (section._type === "headingSection") {
      mapped.level = section.level || "h2";
      mapped.text =
        section[lang === "pl" ? "textPl" : "textEn"] || section.textPl;
    } else if (section._type === "imageSection") {
      mapped.image = section.image
        ? urlFor(section.image).width(1200).fit("max").url()
        : null;
      mapped.alt =
        section.image?.[altKey] || section.image?.altPl || "";
      mapped.caption =
        section[lang === "pl" ? "captionPl" : "captionEn"] || section.captionPl;
    } else if (section._type === "quoteSection") {
      mapped.quote =
        section[lang === "pl" ? "quotePl" : "quoteEn"] || section.quotePl;
      mapped.author =
        section[lang === "pl" ? "authorPl" : "authorEn"] || section.authorPl;
    } else if (section._type === "listSection") {
      mapped.items =
        section[lang === "pl" ? "itemsPl" : "itemsEn"] || section.itemsPl || [];
    } else if (section._type === "calloutSection") {
      mapped.text =
        section[lang === "pl" ? "textPl" : "textEn"] || section.textPl;
      mapped.variant = section.variant || "info";
    }
    return mapped;
  };

  return {
    _id: data._id,
    title: data[titleKey] || data.titlePl || "",
    slug: data.slug?.current || "",
    excerpt: data[excerptKey] || data.excerptPl || "",
    mainImage: data.mainImage
      ? urlFor(data.mainImage).width(1200).height(630).fit("clip").url()
      : undefined,
    mainImageAlt: data.mainImage?.[altKey] || data.mainImage?.altPl || "",
    publishedAt: data.publishedAt || "",
    sections: (data.sections || []).map(mapSection),
  };
}
