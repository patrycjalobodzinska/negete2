import { sanityClient } from "./client";
import type { Language } from "@/i18n/config";

export interface ServiceItem {
  iconKey?: string | null;
  title: string;
  description: string;
}

export interface ServicesSection {
  _id: string;
  heading: string;
  intro?: string;
  services: ServiceItem[];
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
  }>;
}

/**
 * Pobiera z Sanity dokument typu `servicesSection` z tłumaczeniami.
 * Zakłada, że istnieje jeden główny dokument tej sekcji (bierze pierwszy z listy).
 * @param lang - Język, w którym mają być zwrócone dane ('pl' lub 'en')
 */
export async function fetchServicesSection(
  lang: Language = "pl"
): Promise<ServicesSection | null> {
  const query = `
    *[_type == "servicesSection"][0]{
      _id,
      headingPl,
      headingEn,
      introPl,
      introEn,
      services[]{
        iconKey,
        titlePl,
        titleEn,
        descriptionPl,
        descriptionEn
      }
    }
  `;

  const data = await sanityClient.fetch<ServicesSectionRaw | null>(query);

  if (!data) {
    return null;
  }

  // Mapuj dane wielojęzyczne na dane dla wybranego języka
  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const introKey = lang === "pl" ? "introPl" : "introEn";
  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";

  return {
    _id: data._id,
    heading: data[headingKey] || data.headingPl || "",
    intro: data[introKey] || data.introPl,
    services:
      data.services?.map((service) => ({
        iconKey: service.iconKey,
        title: service[titleKey] || service.titlePl || "",
        description: service[descriptionKey] || service.descriptionPl || "",
      })) || [],
  };
}
