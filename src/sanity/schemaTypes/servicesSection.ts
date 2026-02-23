import { defineType, defineField, defineArrayMember } from "sanity";

export const servicesSection = defineType({
  name: "servicesSection",
  title: "Sekcja usług",
  type: "document",
  fieldsets: [
    {
      name: "heading",
      title: "Nagłówek sekcji",
      options: { columns: 2 },
    },
    {
      name: "intro",
      title: "Tekst wprowadzający",
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: "headingPl",
      title: "Nagłówek (Polski)",
      type: "string",
      fieldset: "heading",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingEn",
      title: "Nagłówek (English)",
      type: "string",
      fieldset: "heading",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "introPl",
      title: "Tekst wprowadzający (Polski)",
      type: "text",
      rows: 4,
      fieldset: "intro",
    }),
    defineField({
      name: "introEn",
      title: "Tekst wprowadzający (English)",
      type: "text",
      rows: 4,
      fieldset: "intro",
    }),
    defineField({
      name: "services",
      title: "Usługi",
      type: "array",
      of: [
        defineArrayMember({
          name: "serviceItem",
          title: "Usługa",
          type: "object",
          fields: [
            defineField({
              name: "slug",
              title: "Slug (URL)",
              type: "slug",
              description: "Używany w linkach do podstrony usługi, np. projektowanie-pcb",
              options: { source: "titlePl", maxLength: 96 },
            }),
            defineField({
              name: "iconKey",
              title: "Ikona (klucz)",
              type: "string",
              description:
                "Nazwa ikony z lucide-react, np. 'Cpu', 'Code', 'Box', 'Zap', 'Award', 'Factory'.",
            }),
            defineField({
              name: "titlePl",
              title: "Tytuł (Polski)",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "titleEn",
              title: "Tytuł (English)",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "descriptionPl",
              title: "Opis (Polski)",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "descriptionEn",
              title: "Opis (English)",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "seo",
              title: "SEO podstrony usługi",
              type: "seoFields",
              description:
                "Opcjonalnie. Meta tytuł, opis i obraz OG dla tej podstrony (np. /uslugi/projektowanie-pcb). Puste = użycie tytułu i opisu usługi.",
            }),
            defineField({
              name: "longDescriptionPl",
              title: "Długi opis – podstrona (Polski)",
              type: "text",
              rows: 5,
              description: "Rozwinięty opis wyświetlany na podstronie usługi.",
            }),
            defineField({
              name: "longDescriptionEn",
              title: "Długi opis – podstrona (English)",
              type: "text",
              rows: 5,
            }),
            defineField({
              name: "features",
              title: "Co oferujemy (lista)",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "serviceFeature",
                  fields: [
                    defineField({ name: "titlePl", title: "Tytuł (PL)", type: "string" }),
                    defineField({ name: "titleEn", title: "Tytuł (EN)", type: "string" }),
                    defineField({ name: "descriptionPl", title: "Opis (PL)", type: "text", rows: 2 }),
                    defineField({ name: "descriptionEn", title: "Opis (EN)", type: "text", rows: 2 }),
                  ],
                  preview: { select: { title: "titlePl" } },
                }),
              ],
            }),
            defineField({
              name: "process",
              title: "Jak pracujemy (kroki)",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "processStep",
                  fields: [
                    defineField({ name: "stepPl", title: "Krok (PL)", type: "string" }),
                    defineField({ name: "stepEn", title: "Krok (EN)", type: "string" }),
                    defineField({ name: "descriptionPl", title: "Opis (PL)", type: "text", rows: 2 }),
                    defineField({ name: "descriptionEn", title: "Opis (EN)", type: "text", rows: 2 }),
                  ],
                  preview: { select: { title: "stepPl" } },
                }),
              ],
            }),
            defineField({
              name: "specs",
              title: "Specyfikacja techniczna",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "specItem",
                  fields: [
                    defineField({ name: "labelPl", title: "Etykieta (PL)", type: "string" }),
                    defineField({ name: "labelEn", title: "Etykieta (EN)", type: "string" }),
                    defineField({ name: "valuePl", title: "Wartość (PL)", type: "string" }),
                    defineField({ name: "valueEn", title: "Wartość (EN)", type: "string" }),
                  ],
                  preview: { select: { title: "labelPl" } },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
