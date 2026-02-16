import { getBaseUrl } from "@/lib/site-url";

type JsonLdProps = {
  data: object;
};

/** Wstrzykuje JSON-LD do <head> */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const baseUrl = getBaseUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NeGeTe",
    url: baseUrl,
    logo: `${baseUrl}/negete_logo.png`,
    description:
      "NeGeTe - Twój zewnętrzny dział R&D. Projektowanie elektroniki, mechaniki i oprogramowania. Od pomysłu do produktu.",
    foundingDate: "2024",
  };
  return <JsonLd data={data} />;
}

export function WebSiteJsonLd({ lang }: { lang: string }) {
  const baseUrl = getBaseUrl();
  const langBase = lang === "pl" ? baseUrl : `${baseUrl}/en`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NeGeTe",
    url: langBase,
    inLanguage: lang === "pl" ? "pl-PL" : "en-US",
    publisher: {
      "@type": "Organization",
      name: "NeGeTe",
    },
  };
  return <JsonLd data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  image,
  publishedAt,
  modifiedAt,
  url,
  lang,
}: {
  title: string;
  description?: string;
  image?: string;
  publishedAt: string;
  modifiedAt?: string;
  url: string;
  lang: string;
}) {
  const baseUrl = getBaseUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description || title,
    ...(image && { image: image.startsWith("http") ? image : `${baseUrl}${image}` }),
    datePublished: publishedAt,
    ...(modifiedAt && { dateModified: modifiedAt }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${baseUrl}${url}`,
    },
    inLanguage: lang === "pl" ? "pl-PL" : "en-US",
    publisher: {
      "@type": "Organization",
      name: "NeGeTe",
    },
  };
  return <JsonLd data={data} />;
}

export function FaqPageJsonLd({
  items,
  lang,
}: {
  items: { question: string; answer: string }[];
  lang: string;
}) {
  const baseUrl = getBaseUrl();
  const mainEntity = items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
    inLanguage: lang === "pl" ? "pl-PL" : "en-US",
    url: `${baseUrl}/${lang}/faq`,
  };
  return <JsonLd data={data} />;
}
