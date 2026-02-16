import { defineType, defineField, defineArrayMember } from "sanity";

export const trustedBy = defineType({
  name: "trustedBy",
  title: "Zaufali nam",
  type: "document",
  fieldsets: [
    {
      name: "heading",
      title: "Nagłówek sekcji",
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
    }),
    defineField({
      name: "subtitleEn",
      title: "Podtytuł (English)",
      type: "string",
    }),
    defineField({
      name: "companies",
      title: "Firmy",
      type: "array",
      of: [
        defineArrayMember({
          name: "company",
          title: "Firma",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Nazwa firmy",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "altPl",
                  title: "Tekst alternatywny (Polski)",
                  type: "string",
                },
                {
                  name: "altEn",
                  title: "Tekst alternatywny (English)",
                  type: "string",
                },
              ],
            }),
            defineField({
              name: "project",
              title: "Powiązana realizacja",
              type: "reference",
              to: [{ type: "project" }],
              description: "Opcjonalnie - jeśli wybrano, kliknięcie przeniesie do tej realizacji",
            }),
            defineField({
              name: "url",
              title: "Zewnętrzny link",
              type: "url",
              description: "Opcjonalnie - jeśli nie wybrano realizacji, można podać zewnętrzny link",
            }),
          ],
          preview: {
            select: {
              title: "name",
              media: "logo",
            },
          },
        }),
      ],
    }),
  ],
});
