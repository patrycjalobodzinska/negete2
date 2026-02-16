import { sanityClient } from "./client";
import type { Language } from "@/i18n/config";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface FaqSection {
  heading: string;
  subtitle?: string;
  items: FaqItem[];
}

export async function fetchFaqSection(
  lang: Language = "pl"
): Promise<FaqSection | null> {
  const query = `
    *[_type == "faqSection"][0]{
      headingPl,
      headingEn,
      subtitlePl,
      subtitleEn,
      items[]{
        questionPl,
        questionEn,
        answerPl,
        answerEn
      }
    }
  `;

  const data = await sanityClient.fetch<any>(query);
  if (!data || !data.items?.length) return null;

  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const subtitleKey = lang === "pl" ? "subtitlePl" : "subtitleEn";
  const questionKey = lang === "pl" ? "questionPl" : "questionEn";
  const answerKey = lang === "pl" ? "answerPl" : "answerEn";

  const items: FaqItem[] = data.items.map((item: any, index: number) => ({
    id: index,
    question: item[questionKey] || item.questionPl || "",
    answer: item[answerKey] || item.answerPl || "",
  }));

  return {
    heading: data[headingKey] || data.headingPl || "FAQ",
    subtitle: data[subtitleKey] || data.subtitlePl,
    items,
  };
}
