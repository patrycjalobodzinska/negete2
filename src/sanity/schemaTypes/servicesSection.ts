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
          ],
        }),
      ],
    }),
  ],
});
