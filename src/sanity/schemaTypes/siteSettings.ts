import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ustawienia strony",
  type: "document",
  groups: [
    { name: "general", title: "Ogólne" },
    { name: "home", title: "Strona główna" },
    { name: "footer", title: "Stopka" },
    { name: "faq", title: "FAQ" },
    { name: "contact", title: "Kontakt" },
    { name: "blog", title: "Lista bloga" },
    { name: "realizacje", title: "Lista realizacji" },
    { name: "proces", title: "Strona procesu" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Nazwa witryny",
      type: "string",
      group: "general",
      description: "Używana w tytułach (np. „NeGeTe | Strona główna”)",
      initialValue: "NeGeTe",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Domyślny obraz OG",
      type: "image",
      group: "general",
      description: "Fallback dla Open Graph, gdy strona nie ma własnego obrazu",
      options: { hotspot: true },
    }),

    // Stopka
    defineField({
      name: "footerDescriptionPl",
      title: "Opis w stopce (Polski)",
      type: "text",
      rows: 3,
      group: "footer",
      initialValue:
        "Twój zewnętrzny dział R&D. Od pomysłu do seryjnej produkcji. Profesjonalne usługi w dziedzinie elektroniki, mechaniki i oprogramowania.",
    }),
    defineField({
      name: "footerDescriptionEn",
      title: "Opis w stopce (English)",
      type: "text",
      rows: 3,
      group: "footer",
      initialValue:
        "Your external R&D department. From idea to serial production. Professional services in electronics, mechanics and software.",
    }),
    defineField({
      name: "footerContactItems",
      title: "Dane kontaktowe",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          name: "contactItem",
          title: "Element kontaktu",
          fields: [
            {
              name: "icon",
              title: "Ikona",
              type: "string",
              options: {
                list: [
                  { title: "Email", value: "Mail" },
                  { title: "Telefon", value: "Phone" },
                  { title: "Lokalizacja", value: "MapPin" },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            { name: "textPl", title: "Tekst (Polski)", type: "string" },
            { name: "textEn", title: "Tekst (English)", type: "string" },
            { name: "url", title: "URL (mailto:, tel: lub link)", type: "string" },
          ],
          preview: {
            select: { title: "textPl" },
          },
        },
      ],
    }),
    defineField({
      name: "footerSocialLinks",
      title: "Social media",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          name: "socialItem",
          title: "Social",
          fields: [
            {
              name: "icon",
              title: "Ikona (Lucide)",
              type: "string",
              description: "Nazwa ikony z lucide-react, np. Linkedin, Github, Twitter, Facebook, Instagram",
              options: {
                list: [
                  { title: "LinkedIn", value: "Linkedin" },
                  { title: "GitHub", value: "Github" },
                  { title: "Twitter/X", value: "Twitter" },
                  { title: "Facebook", value: "Facebook" },
                  { title: "Instagram", value: "Instagram" },
                  { title: "YouTube", value: "Youtube" },
                ],
              },
            },
            { name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { title: "icon" },
          },
        },
      ],
    }),

    // Strona główna
    defineField({
      name: "homePageSeo",
      title: "Meta strony głównej",
      type: "seoFields",
      group: "home",
    }),

    // FAQ
    defineField({
      name: "faqPageSeo",
      title: "Meta strony FAQ",
      type: "seoFields",
      group: "faq",
    }),

    // Kontakt
    defineField({
      name: "contactPageSeo",
      title: "Meta strony Kontakt",
      type: "seoFields",
      group: "contact",
    }),

    // Lista bloga
    defineField({
      name: "blogListPageSeo",
      title: "Meta strony Blog (lista)",
      type: "seoFields",
      group: "blog",
    }),

    // Lista realizacji
    defineField({
      name: "realizacjeListPageSeo",
      title: "Meta strony Realizacje (lista)",
      type: "seoFields",
      group: "realizacje",
    }),

    // Strona procesu – tu używamy danych z processPage, ale można dodać domyślne
    defineField({
      name: "processPageSeo",
      title: "Meta strony Proces (gdy brak w dokumencie Proces)",
      type: "seoFields",
      group: "proces",
      description:
        "Fallback, jeśli dokument Strona Procesu nie ma wypełnionych pól SEO",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Ustawienia strony" }),
  },
});
