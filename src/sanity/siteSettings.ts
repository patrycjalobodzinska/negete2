import { sanityClient } from "./client";
import type { Language } from "@/i18n/config";
import { urlFor } from "./image";

export interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface SiteSettings {
  siteName: string;
  defaultOgImage?: string;
  homePageSeo?: SeoData;
  faqPageSeo?: SeoData;
  contactPageSeo?: SeoData;
  blogListPageSeo?: SeoData;
  realizacjeListPageSeo?: SeoData;
  processPageSeo?: SeoData;
}

function mapSeo(raw: {
  metaTitlePl?: string;
  metaTitleEn?: string;
  metaDescriptionPl?: string;
  metaDescriptionEn?: string;
  ogImage?: { asset?: { _ref?: string }; [key: string]: unknown };
} | null | undefined, lang: Language): SeoData | undefined {
  if (!raw) return undefined;
  const titleKey = lang === "pl" ? "metaTitlePl" : "metaTitleEn";
  const descKey = lang === "pl" ? "metaDescriptionPl" : "metaDescriptionEn";
  const title = raw[titleKey as keyof typeof raw] as string | undefined;
  const desc = raw[descKey as keyof typeof raw] as string | undefined;
  const og = raw.ogImage
    ? urlFor(raw.ogImage).width(1200).height(630).fit("clip").url()
    : undefined;
  if (!title && !desc && !og) return undefined;
  return {
    metaTitle: title || undefined,
    metaDescription: desc || undefined,
    ogImage: og,
  };
}

export async function fetchSiteSettings(
  lang: Language = "pl"
): Promise<SiteSettings | null> {
  const query = `
    *[_type == "siteSettings" && _id == "siteSettings"][0]{
      siteName,
      defaultOgImage,
      homePageSeo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } },
      faqPageSeo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } },
      contactPageSeo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } },
      blogListPageSeo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } },
      realizacjeListPageSeo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } },
      processPageSeo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } }
    }
  `;
  const data = await sanityClient.fetch<any | null>(query);
  if (!data) return null;

  const defaultOg = data.defaultOgImage
    ? urlFor(data.defaultOgImage).width(1200).height(630).fit("clip").url()
    : undefined;

  return {
    siteName: data.siteName || "NeGeTe",
    defaultOgImage: defaultOg,
    homePageSeo: mapSeo(data.homePageSeo, lang),
    faqPageSeo: mapSeo(data.faqPageSeo, lang),
    contactPageSeo: mapSeo(data.contactPageSeo, lang),
    blogListPageSeo: mapSeo(data.blogListPageSeo, lang),
    realizacjeListPageSeo: mapSeo(data.realizacjeListPageSeo, lang),
    processPageSeo: mapSeo(data.processPageSeo, lang),
  };
}
