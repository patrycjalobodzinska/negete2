import { defineType, defineField, defineArrayMember } from "sanity";

export const statsSection = defineType({
  name: "statsSection",
  title: "Sekcja statystyk (strona główna)",
  type: "document",
  fields: [
    defineField({
      name: "headingPl",
      title: "Nagłówek (Polski)",
      type: "string",
    }),
    defineField({
      name: "headingEn",
      title: "Nagłówek (English)",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Statystyki",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "statItem",
          title: "Statystyka",
          fields: [
            {
              name: "value",
              title: "Wartość",
              type: "string",
              description: "Np. liczba (50+) lub tekst (100%)",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "labelPl",
              title: "Treść / opis (Polski)",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "labelEn",
              title: "Treść / opis (English)",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { value: "value", labelPl: "labelPl" },
            prepare({ value, labelPl }) {
              return {
                title: value ?? "—",
                subtitle: labelPl ?? "",
              };
            },
          },
        }),
      ],
    }),
  ],
});
