import { defineType, defineField, defineArrayMember } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Artykuł bloga",
  type: "document",
  fields: [
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
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: {
        source: "titlePl",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerptPl",
      title: "Krótki opis / lead (Polski)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "excerptEn",
      title: "Krótki opis / lead (English)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "mainImage",
      title: "Główne zdjęcie",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "altPl", title: "Alt (Polski)", type: "string" },
        { name: "altEn", title: "Alt (English)", type: "string" },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Data publikacji",
      type: "datetime",
      description:
        "Artykuł pojawi się dopiero od tej daty. Puste = widoczny od razu.",
    }),
    defineField({
      name: "sections",
      title: "Treść artykułu",
      type: "array",
      description: "Dodaj sekcje – wybierz gotowy typ bloku",
      of: [
        defineArrayMember({
          type: "object",
          name: "paragraphSection",
          title: "Akapit tekstu",
          icon: () => "¶",
          fields: [
            defineField({
              name: "contentPl",
              title: "Treść (Polski)",
              type: "text",
              rows: 5,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "contentEn",
              title: "Treść (English)",
              type: "text",
              rows: 5,
            }),
          ],
          preview: {
            select: { content: "contentPl" },
            prepare({ content }) {
              return {
                title: "Akapit",
                subtitle: content ? content.slice(0, 50) + "…" : "",
              };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "headingSection",
          title: "Nagłówek",
          icon: () => "H",
          fields: [
            defineField({
              name: "level",
              title: "Poziom",
              type: "string",
              options: {
                list: [
                  { title: "H2", value: "h2" },
                  { title: "H3", value: "h3" },
                ],
              },
              initialValue: "h2",
            }),
            defineField({
              name: "textPl",
              title: "Tekst (Polski)",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "textEn",
              title: "Tekst (English)",
              type: "string",
            }),
          ],
          preview: {
            select: { text: "textPl" },
            prepare({ text }) {
              return { title: "Nagłówek", subtitle: text };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "imageSection",
          title: "Obraz",
          icon: () => "🖼",
          fields: [
            defineField({
              name: "image",
              title: "Zdjęcie",
              type: "image",
              options: { hotspot: true },
              fields: [
                { name: "altPl", title: "Alt (Polski)", type: "string" },
                { name: "altEn", title: "Alt (English)", type: "string" },
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "captionPl",
              title: "Podpis (Polski)",
              type: "string",
            }),
            defineField({
              name: "captionEn",
              title: "Podpis (English)",
              type: "string",
            }),
          ],
          preview: {
            select: { media: "image" },
            prepare({ media }) {
              return { title: "Obraz", media };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "quoteSection",
          title: "Cytat",
          icon: () => "„",
          fields: [
            defineField({
              name: "quotePl",
              title: "Cytat (Polski)",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quoteEn",
              title: "Cytat (English)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "authorPl",
              title: "Autor (Polski)",
              type: "string",
            }),
            defineField({
              name: "authorEn",
              title: "Autor (English)",
              type: "string",
            }),
          ],
          preview: {
            select: { quote: "quotePl" },
            prepare({ quote }) {
              return {
                title: "Cytat",
                subtitle: quote ? quote.slice(0, 40) + "…" : "",
              };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "listSection",
          title: "Lista punktowana",
          icon: () => "•",
          fields: [
            defineField({
              name: "itemsPl",
              title: "Elementy (Polski)",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "itemsEn",
              title: "Elementy (English)",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: {
            select: { items: "itemsPl" },
            prepare({ items }) {
              const count = Array.isArray(items) ? items.length : 0;
              return { title: "Lista", subtitle: `${count} elementów` };
            },
          },
        }),
        defineArrayMember({
          type: "object",
          name: "calloutSection",
          title: "Wyróżniona uwaga",
          icon: () => "💡",
          fields: [
            defineField({
              name: "textPl",
              title: "Treść (Polski)",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "textEn",
              title: "Treść (English)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "variant",
              title: "Typ",
              type: "string",
              options: {
                list: [
                  { title: "Informacja", value: "info" },
                  { title: "Sukces / pozytywny", value: "success" },
                  { title: "Ostrzeżenie", value: "warning" },
                ],
              },
              initialValue: "info",
            }),
          ],
          preview: {
            select: { text: "textPl" },
            prepare({ text }) {
              return {
                title: "Wyróżniona uwaga",
                subtitle: text ? text.slice(0, 40) + "…" : "",
              };
            },
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Data publikacji (najnowsze)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Data publikacji (najstarsze)",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "titlePl",
      subtitle: "publishedAt",
      media: "mainImage",
    },
    prepare({ title, subtitle }) {
      const date = subtitle ? new Date(subtitle).toLocaleDateString("pl-PL") : "";
      return {
        title: title || "Bez tytułu",
        subtitle: date,
      };
    },
  },
});
