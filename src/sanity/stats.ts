import { sanityClient } from "./client";
import type { Language } from "@/i18n/config";

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsSection {
  _id: string;
  heading?: string;
  items: StatItem[];
}

interface StatsSectionRaw {
  _id: string;
  headingPl?: string;
  headingEn?: string;
  items?: Array<{
    value?: string;
    labelPl?: string;
    labelEn?: string;
  }>;
}

/**
 * Pobiera z Sanity dokument typu `statsSection` z tłumaczeniami.
 */
export async function fetchStatsSection(
  lang: Language = "pl",
): Promise<StatsSection | null> {
  const query = `
    *[_type == "statsSection"][0]{
      _id,
      headingPl,
      headingEn,
      items[]{
        value,
        labelPl,
        labelEn
      }
    }
  `;

  const data = await sanityClient.fetch<StatsSectionRaw | null>(query);

  if (!data) {
    return null;
  }

  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const labelKey = lang === "pl" ? "labelPl" : "labelEn";

  return {
    _id: data._id,
    heading: data[headingKey] || data.headingPl || undefined,
    items:
      data.items?.map((item) => ({
        value: item.value ?? "",
        label: (item[labelKey as keyof typeof item] as string) || item.labelPl || "",
      })) ?? [],
  };
}
