import type { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/client";
import { languages } from "@/i18n/config";
import { getBaseUrl } from "@/lib/site-url";

const baseUrl = getBaseUrl();

const staticPaths = ["", "faq", "kontakt", "proces", "uslugi", "blog", "realizacje"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Strona główna bez prefiksu (pl)
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });

  // Strony statyczne w obu językach
  for (const lang of languages) {
    const prefix = `/${lang}`;
    for (const path of staticPaths) {
      const url = path ? `${baseUrl}${prefix}/${path}` : `${baseUrl}${prefix}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.9,
      });
    }
  }

  // Artykuły bloga
  const blogSlugs = await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "blogPost" && (!defined(publishedAt) || publishedAt <= now())]{ "slug": slug.current }`
  );
  for (const lang of languages) {
    for (const post of blogSlugs ?? []) {
      if (post.slug) {
        entries.push({
          url: `${baseUrl}/${lang}/blog/${post.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  // Usługi
  const servicesDoc = await sanityClient.fetch<{
    services?: { slug?: { current?: string } }[];
  } | null>(`*[_type == "servicesSection"][0]{ services[] { slug { current } } }`);
  const serviceSlugs = servicesDoc?.services ?? [];
  for (const lang of languages) {
    for (const s of serviceSlugs) {
      const slug = s.slug?.current;
      if (slug) {
        entries.push({
          url: `${baseUrl}/${lang}/uslugi/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  // Projekty / realizacje
  const projectSlugs = await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "project"]{ "slug": slug.current }`
  );
  for (const lang of languages) {
    for (const project of projectSlugs ?? []) {
      if (project.slug) {
        entries.push({
          url: `${baseUrl}/${lang}/realizacje/${project.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  return entries;
}
