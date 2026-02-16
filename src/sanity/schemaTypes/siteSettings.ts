import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ustawienia strony",
  type: "document",
  groups: [
    { name: "general", title: "Ogólne" },
    { name: "home", title: "Strona główna" },
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
