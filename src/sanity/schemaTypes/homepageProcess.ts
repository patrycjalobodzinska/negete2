import { defineType, defineField, defineArrayMember } from "sanity";

export const homepageProcess = defineType({
  name: "homepageProcess",
  title: "Proces na stronie głównej",
  type: "document",
  fieldsets: [
    {
      name: "heading",
      title: "Nagłówek sekcji",
      options: { columns: 2 },
    },
    {
      name: "subtitle",
      title: "Podtytuł sekcji",
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: "headingPl",
      title: "Nagłówek (Polski)",
      type: "string",
      fieldset: "heading",
    }),
    defineField({
      name: "headingEn",
      title: "Nagłówek (English)",
      type: "string",
      fieldset: "heading",
    }),
    defineField({
      name: "subtitlePl",
      title: "Podtytuł (Polski)",
      type: "string",
      fieldset: "subtitle",
    }),
    defineField({
      name: "subtitleEn",
      title: "Podtytuł (English)",
      type: "string",
      fieldset: "subtitle",
    }),
    defineField({
      name: "groups",
      title: "Grupy procesu",
      type: "array",
      of: [
        defineArrayMember({
          name: "processGroup",
          title: "Grupa",
          type: "object",
          fields: [
            defineField({
              name: "iconKey",
              title: "Ikona",
              type: "string",
              description:
                "Nazwa ikony z lucide-react, np. 'Search', 'Layers', 'Box', 'Factory'.",
            }),
            defineField({
              name: "namePl",
              title: "Nazwa (Polski)",
              type: "string",
            }),
            defineField({
              name: "nameEn",
              title: "Nazwa (English)",
              type: "string",
            }),
            defineField({
              name: "shortNamePl",
              title: "Krótka nazwa (Polski)",
              type: "string",
              description: "Używana przy ikonie na osi czasu",
            }),
            defineField({
              name: "shortNameEn",
              title: "Krótka nazwa (English)",
              type: "string",
              description: "Używana przy ikonie na osi czasu",
            }),
            defineField({
              name: "descriptionPl",
              title: "Opis (Polski)",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "descriptionEn",
              title: "Opis (English)",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "color",
              title: "Kolor",
              type: "string",
              description: "Kolor w formacie hex, np. #00f0ff",
              initialValue: "#00f0ff",
            }),
            defineField({
              name: "details",
              title: "Lista szczegółów",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "textPl",
                      title: "Tekst (Polski)",
                      type: "string",
                    }),
                    defineField({
                      name: "textEn",
                      title: "Tekst (English)",
                      type: "string",
                    }),
                  ],
                  preview: {
                    select: {
                      title: "textPl",
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "namePl",
              subtitle: "descriptionPl",
            },
          },
        }),
      ],
    }),
  ],
});
