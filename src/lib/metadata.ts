import type { Metadata } from "next";

type SeoLike = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
};

type BuildMetadataParams = {
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
  lang: string;
  canonical?: string;
  seo?: SeoLike | null;
};

const DEFAULT_DESCRIPTION =
  "NeGeTe - Twój zewnętrzny dział R&D. Projektowanie elektroniki, mechaniki i oprogramowania. Od pomysłu do produktu.";

/**
 * Buduje obiekt Metadata dla Next.js z opcjonalnych danych SEO z Sanity.
 * Priorytet: seo.metaTitle > title, seo.metaDescription > description, seo.ogImage > image.
 */
export function buildMetadata({
  title,
  description,
  image,
  siteName = "NeGeTe",
  lang,
  canonical,
  seo,
}: BuildMetadataParams): Metadata {
  const metaTitle = seo?.metaTitle || title;
  const metaDescription =
    seo?.metaDescription || description || DEFAULT_DESCRIPTION;
  const ogImage = seo?.ogImage || image;
  const fullTitle = metaTitle.includes(siteName)
    ? metaTitle
    : `${metaTitle} | ${siteName}`;

  return {
    title: fullTitle,
    description: metaDescription,
    ...(canonical && {
      alternates: { canonical },
    }),
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
      locale: lang === "pl" ? "pl_PL" : "en_US",
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
