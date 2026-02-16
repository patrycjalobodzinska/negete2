import type { Metadata } from "next";
import { getBaseUrl } from "./site-url";
import { languages } from "@/i18n/config";

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
  path: string; // np. "/", "/faq", "/blog/post-slug"
  canonical?: string;
  seo?: SeoLike | null;
};

const DEFAULT_DESCRIPTION =
  "NeGeTe - Twój zewnętrzny dział R&D. Projektowanie elektroniki, mechaniki i oprogramowania. Od pomysłu do produktu.";

/**
 * Buduje canonical URL i alternates (hreflang) dla strony.
 * path – pełna ścieżka np. "/", "/pl/faq", "/en/blog/post-slug"
 */
function buildAlternates(path: string, baseUrl: string) {
  const pathNorm = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${baseUrl}${pathNorm}`;
  const segments = pathNorm.split("/").filter(Boolean);
  const isLangFirst =
    segments.length > 0 && (segments[0] === "pl" || segments[0] === "en");
  const rest = isLangFirst ? segments.slice(1).join("/") : "";

  const languagesRecord: Record<string, string> = {};
  languagesRecord["pl"] = rest ? `${baseUrl}/pl/${rest}` : baseUrl + "/";
  languagesRecord["en"] = rest ? `${baseUrl}/en/${rest}` : baseUrl + "/en";

  return { canonical, languages: languagesRecord };
}

/**
 * Buduje obiekt Metadata dla Next.js z opcjonalnych danych SEO z Sanity.
 * Priorytet: seo.metaTitle > title, seo.metaDescription > description, seo.ogImage > image.
 * Zawiera canonical URL oraz hreflang dla i18n.
 */
export function buildMetadata({
  title,
  description,
  image,
  siteName = "NeGeTe",
  lang,
  path,
  canonical: canonicalOverride,
  seo,
}: BuildMetadataParams): Metadata {
  const baseUrl = getBaseUrl();
  const { canonical, languages: langUrls } = buildAlternates(path, baseUrl);
  const canonicalUrl = canonicalOverride || canonical;

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
    alternates: {
      canonical: canonicalUrl,
      languages: langUrls,
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
      locale: lang === "pl" ? "pl_PL" : "en_US",
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
