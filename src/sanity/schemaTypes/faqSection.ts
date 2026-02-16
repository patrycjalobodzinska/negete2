import { defineType, defineField, defineArrayMember } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "Sekcja FAQ",
  type: "document",
  fields: [
    defineField({
      name: "headingPl",
      title: "Nagłówek (Polski)",
      type: "string",
      initialValue: "Często zadawane pytania",
    }),
    defineField({
      name: "headingEn",
      title: "Nagłówek (English)",
      type: "string",
      initialValue: "Frequently asked questions",
    }),
    defineField({
      name: "subtitlePl",
      title: "Podtytuł (Polski)",
      type: "text",
      rows: 2,
      description: "Opcjonalny krótki opis nad pytaniami",
    }),
    defineField({
      name: "subtitleEn",
      title: "Podtytuł (English)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "items",
      title: "Pytania i odpowiedzi",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "questionPl",
              title: "Pytanie (Polski)",
              type: "string",
            }),
            defineField({
              name: "questionEn",
              title: "Pytanie (English)",
              type: "string",
            }),
            defineField({
              name: "answerPl",
              title: "Odpowiedź (Polski)",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "answerEn",
              title: "Odpowiedź (English)",
              type: "text",
              rows: 4,
            }),
          ],
          preview: {
            select: { questionPl: "questionPl" },
            prepare: ({ questionPl }) => ({ title: questionPl || "Pytanie" }),
          },
        }),
      ],
    }),
  ],
});
