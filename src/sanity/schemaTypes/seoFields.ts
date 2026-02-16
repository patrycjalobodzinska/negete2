import { defineType, defineField } from "sanity";

/**
 * Wspólny obiekt SEO – używany w dokumentach (blog, projekt) oraz w siteSettings.
 * Puste pola = fallback do tytułu/opisu/głównego obrazu dokumentu.
 */
export const seoFields = defineType({
  name: "seoFields",
  title: "SEO / Meta",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
    columns: 2,
  },
  fields: [
    defineField({
      name: "metaTitlePl",
      title: "Meta tytuł (Polski)",
      type: "string",
      description: "Tytuł w wynikach wyszukiwania. Pusty = użycie tytułu strony.",
      validation: (Rule) => Rule.max(60).warning("Optymalnie do 60 znaków"),
    }),
    defineField({
      name: "metaTitleEn",
      title: "Meta tytuł (English)",
      type: "string",
      validation: (Rule) => Rule.max(60).warning("Optymalnie do 60 znaków"),
    }),
    defineField({
      name: "metaDescriptionPl",
      title: "Meta opis (Polski)",
      type: "text",
      rows: 2,
      description: "Opis w wynikach wyszukiwania. Pusty = użycie opisu strony.",
      validation: (Rule) => Rule.max(160).warning("Optymalnie do 160 znaków"),
    }),
    defineField({
      name: "metaDescriptionEn",
      title: "Meta opis (English)",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(160).warning("Optymalnie do 160 znaków"),
    }),
    defineField({
      name: "ogImage",
      title: "Obraz Open Graph / Twitter",
      type: "image",
      description:
        "Opcjonalnie. Dla udostępniania w social media. Pusty = główny obraz strony.",
      options: { hotspot: true },
    }),
  ],
});
