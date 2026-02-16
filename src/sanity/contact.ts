import { sanityClient } from "./client";
import { type Language } from "@/i18n/config";
import { urlFor } from "./image";

export interface ContactSection {
  heading: string;
  subtitle?: string;
  personName: string;
  personRole?: string;
  personImage?: string;
  email?: string;
  bio?: string;
  nameLabel: string;
  companyLabel: string;
  messageLabel: string;
  submitButton: string;
  successMessage: string;
  errorMessage: string;
  requiredError: string;
  invalidEmail: string;
}

export async function fetchContactSection(
  lang: Language = "pl"
): Promise<ContactSection | null> {
  const query = `
    *[_type == "contactSection"][0]{
      headingPl,
      headingEn,
      subtitlePl,
      subtitleEn,
      personImage,
      personNamePl,
      personNameEn,
      personRolePl,
      personRoleEn,
      email,
      bioPl,
      bioEn,
      nameLabelPl,
      nameLabelEn,
      companyLabelPl,
      companyLabelEn,
      messageLabelPl,
      messageLabelEn,
      submitButtonPl,
      submitButtonEn,
      successMessagePl,
      successMessageEn,
      errorMessagePl,
      errorMessageEn,
      requiredErrorPl,
      requiredErrorEn,
      invalidEmailPl,
      invalidEmailEn
    }
  `;

  const data = await sanityClient.fetch<any>(query);

  if (!data) {
    return null;
  }

  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const nameKey = lang === "pl" ? "personNamePl" : "personNameEn";
  const roleKey = lang === "pl" ? "personRolePl" : "personRoleEn";
  const bioKey = lang === "pl" ? "bioPl" : "bioEn";
  const nameLabelKey = lang === "pl" ? "nameLabelPl" : "nameLabelEn";
  const companyLabelKey = lang === "pl" ? "companyLabelPl" : "companyLabelEn";
  const messageLabelKey = lang === "pl" ? "messageLabelPl" : "messageLabelEn";
  const submitKey = lang === "pl" ? "submitButtonPl" : "submitButtonEn";
  const successKey = lang === "pl" ? "successMessagePl" : "successMessageEn";
  const errorKey = lang === "pl" ? "errorMessagePl" : "errorMessageEn";
  const requiredKey = lang === "pl" ? "requiredErrorPl" : "requiredErrorEn";
  const invalidEmailKey = lang === "pl" ? "invalidEmailPl" : "invalidEmailEn";

  return {
    heading: data[headingKey] || data.headingPl || "Kontakt",
    subtitle: data[lang === "pl" ? "subtitlePl" : "subtitleEn"] || data.subtitlePl,
    personName: data[nameKey] || data.personNamePl || "",
    personRole: data[roleKey] || data.personRolePl,
    personImage: data.personImage
      ? urlFor(data.personImage).width(800).height(800).url()
      : undefined,
    email: data.email,
    bio: data[bioKey] || data.bioPl,
    nameLabel: data[nameLabelKey] || data.nameLabelPl || "Imię",
    companyLabel: data[companyLabelKey] || data.companyLabelPl || "Nazwa firmy",
    messageLabel: data[messageLabelKey] || data.messageLabelPl || "",
    submitButton: data[submitKey] || data.submitButtonPl || "Wyślij wiadomość",
    successMessage:
      data[successKey] ||
      data.successMessagePl ||
      "Dziękujemy! Twoja wiadomość została wysłana. Skontaktujemy się z Tobą wkrótce.",
    errorMessage:
      data[errorKey] ||
      data.errorMessagePl ||
      "Wystąpił błąd. Spróbuj ponownie lub skontaktuj się bezpośrednio przez email.",
    requiredError: data[requiredKey] || data.requiredErrorPl || "To pole jest wymagane",
    invalidEmail: data[invalidEmailKey] || data.invalidEmailPl || "Podaj prawidłowy adres email",
  };
}
