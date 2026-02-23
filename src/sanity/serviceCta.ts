import { sanityClient } from "./client";
import type { Language } from "@/i18n/config";

export interface ServiceCtaSection {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

interface ServiceCtaSectionRaw {
  titlePl?: string;
  titleEn?: string;
  descriptionPl?: string;
  descriptionEn?: string;
  buttonTextPl?: string;
  buttonTextEn?: string;
  link?: string;
}

export async function fetchServiceCtaSection(
  lang: Language = "pl"
): Promise<ServiceCtaSection | null> {
  const query = `
    *[_type == "serviceCtaSection"][0]{
      titlePl,
      titleEn,
      descriptionPl,
      descriptionEn,
      buttonTextPl,
      buttonTextEn,
      link
    }
  `;
  const data = await sanityClient.fetch<ServiceCtaSectionRaw | null>(query);
  if (!data) return null;

  const isPl = lang === "pl";
  return {
    title: (isPl ? data.titlePl : data.titleEn) || data.titlePl || "Zainteresowany tą usługą?",
    description:
      (isPl ? data.descriptionPl : data.descriptionEn) ||
      data.descriptionPl ||
      "Skontaktuj się z nami, aby omówić jak możemy pomóc w realizacji Twojego projektu.",
    buttonText: (isPl ? data.buttonTextPl : data.buttonTextEn) || data.buttonTextPl || "Skontaktuj się",
    link: data.link || "/kontakt",
  };
}
