import { defineType, defineField } from "sanity";

export const serviceCtaSection = defineType({
  name: "serviceCtaSection",
  title: "Sekcja CTA podstrony usługi",
  type: "document",
  description:
    "Blok „Zainteresowany tą usługą?” na dole każdej podstrony usługi (tytuł, opis, przycisk).",
  fields: [
    defineField({
      name: "titlePl",
      title: "Tytuł (Polski)",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Zainteresowany tą usługą?",
    }),
    defineField({
      name: "titleEn",
      title: "Tytuł (English)",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Interested in this service?",
    }),
    defineField({
      name: "descriptionPl",
      title: "Opis (Polski)",
      type: "text",
      rows: 3,
      initialValue:
        "Skontaktuj się z nami, aby omówić jak możemy pomóc w realizacji Twojego projektu.",
    }),
    defineField({
      name: "descriptionEn",
      title: "Opis (English)",
      type: "text",
      rows: 3,
      initialValue:
        "Contact us to discuss how we can help bring your project to life.",
    }),
    defineField({
      name: "buttonTextPl",
      title: "Tekst przycisku (Polski)",
      type: "string",
      initialValue: "Skontaktuj się",
    }),
    defineField({
      name: "buttonTextEn",
      title: "Tekst przycisku (English)",
      type: "string",
      initialValue: "Contact us",
    }),
    defineField({
      name: "link",
      title: "Link przycisku",
      type: "string",
      description: "Np. /kontakt (bez języka – dodawany automatycznie)",
      initialValue: "/kontakt",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Sekcja CTA podstrony usługi" }),
  },
});
