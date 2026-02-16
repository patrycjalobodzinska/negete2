import { defineType, defineField, defineArrayMember } from "sanity";

export const portfolioSection = defineType({
  name: "portfolioSection",
  title: "Sekcja Portfolio",
  type: "document",
  fieldsets: [
    {
      name: "heading",
      title: "Nagłówek sekcji",
      options: { columns: 2 },
    },
    {
      name: "description",
      title: "Opis sekcji",
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
      name: "descriptionPl",
      title: "Opis (Polski)",
      type: "text",
      rows: 3,
      fieldset: "description",
    }),
    defineField({
      name: "descriptionEn",
      title: "Opis (English)",
      type: "text",
      rows: 3,
      fieldset: "description",
    }),
    defineField({
      name: "projects",
      title: "Wybrane projekty",
      type: "array",
      description:
        "Wybierz projekty, które mają być wyświetlone na stronie głównej. Możesz zmieniać kolejność przeciągając elementy.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "headingPl",
    },
  },
});
