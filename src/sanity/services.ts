import { sanityClient } from "./client";
import { urlFor } from "./image";
import type { Language } from "@/i18n/config";
import type { SeoData } from "./siteSettings";

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  step: string;
  description: string;
}

export interface ServiceSpec {
  label: string;
  value: string;
}

export interface ServiceItem {
  iconKey?: string | null;
  title: string;
  description: string;
  slug?: string;
  seo?: SeoData;
  longDescription?: string;
  features?: ServiceFeature[];
  process?: ServiceProcessStep[];
  specs?: ServiceSpec[];
}

export interface ServicesSection {
  _id: string;
  heading: string;
  intro?: string;
  services: ServiceItem[];
}

interface ServiceSeoRaw {
  metaTitlePl?: string;
  metaTitleEn?: string;
  metaDescriptionPl?: string;
  metaDescriptionEn?: string;
  ogImage?: { asset?: { _ref?: string }; [key: string]: unknown };
}

function mapServiceSeo(
  raw: ServiceSeoRaw | null | undefined,
  lang: Language,
): SeoData | undefined {
  if (!raw) return undefined;
  const titleKey = lang === "pl" ? "metaTitlePl" : "metaTitleEn";
  const descKey = lang === "pl" ? "metaDescriptionPl" : "metaDescriptionEn";
  const title = raw[titleKey as keyof ServiceSeoRaw] as string | undefined;
  const desc = raw[descKey as keyof ServiceSeoRaw] as string | undefined;
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

interface ServiceFeatureRaw {
  titlePl?: string;
  titleEn?: string;
  descriptionPl?: string;
  descriptionEn?: string;
}

interface ServiceProcessRaw {
  stepPl?: string;
  stepEn?: string;
  descriptionPl?: string;
  descriptionEn?: string;
}

interface ServiceSpecRaw {
  labelPl?: string;
  labelEn?: string;
  valuePl?: string;
  valueEn?: string;
}

interface ServicesSectionRaw {
  _id: string;
  headingPl?: string;
  headingEn?: string;
  introPl?: string;
  introEn?: string;
  services?: Array<{
    iconKey?: string | null;
    titlePl?: string;
    titleEn?: string;
    descriptionPl?: string;
    descriptionEn?: string;
    slug?: { current?: string } | string;
    seo?: ServiceSeoRaw;
    longDescriptionPl?: string;
    longDescriptionEn?: string;
    features?: ServiceFeatureRaw[];
    process?: ServiceProcessRaw[];
    specs?: ServiceSpecRaw[];
  }>;
}

/**
 * Pobiera z Sanity dokument typu `servicesSection` z tłumaczeniami.
 * Zakłada, że istnieje jeden główny dokument tej sekcji (bierze pierwszy z listy).
 * @param lang - Język, w którym mają być zwrócone dane ('pl' lub 'en')
 */
export async function fetchServicesSection(
  lang: Language = "pl",
): Promise<ServicesSection | null> {
  const query = `
    *[_type == "servicesSection"][0]{
      _id,
      headingPl,
      headingEn,
      introPl,
      introEn,
      services[]{
        slug{ current },
        iconKey,
        titlePl,
        titleEn,
        descriptionPl,
        descriptionEn,
        seo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } },
        longDescriptionPl,
        longDescriptionEn,
        features[]{ titlePl, titleEn, descriptionPl, descriptionEn },
        process[]{ stepPl, stepEn, descriptionPl, descriptionEn },
        specs[]{ labelPl, labelEn, valuePl, valueEn }
      }
    }
  `;

  const data = await sanityClient.fetch<ServicesSectionRaw | null>(query);

  if (!data) {
    return null;
  }

  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const introKey = lang === "pl" ? "introPl" : "introEn";
  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";

  const mapFeature = (f: ServiceFeatureRaw): ServiceFeature => ({
    title: (lang === "pl" ? f.titlePl : f.titleEn) || f.titlePl || "",
    description:
      (lang === "pl" ? f.descriptionPl : f.descriptionEn) ||
      f.descriptionPl ||
      "",
  });
  const mapProcessStep = (p: ServiceProcessRaw): ServiceProcessStep => ({
    step: (lang === "pl" ? p.stepPl : p.stepEn) || p.stepPl || "",
    description:
      (lang === "pl" ? p.descriptionPl : p.descriptionEn) ||
      p.descriptionPl ||
      "",
  });
  const mapSpec = (s: ServiceSpecRaw): ServiceSpec => ({
    label: (lang === "pl" ? s.labelPl : s.labelEn) || s.labelPl || "",
    value: (lang === "pl" ? s.valuePl : s.valueEn) || s.valuePl || "",
  });

  return {
    _id: data._id,
    heading: data[headingKey] || data.headingPl || "",
    intro: data[introKey] || data.introPl,
    services:
      data.services?.map((service) => ({
        iconKey: service.iconKey,
        title: service[titleKey] || service.titlePl || "",
        description: service[descriptionKey] || service.descriptionPl || "",
        slug:
          typeof service.slug === "string"
            ? service.slug
            : service.slug?.current,
        seo: mapServiceSeo(service.seo, lang),
        longDescription:
          (lang === "pl"
            ? service.longDescriptionPl
            : service.longDescriptionEn) || service.longDescriptionPl,
        features: service.features?.map(mapFeature),
        process: service.process?.map(mapProcessStep),
        specs: service.specs?.map(mapSpec),
      })) || [],
  };
}
