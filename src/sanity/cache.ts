import { unstable_cache } from "next/cache";
import type { Language } from "@/i18n/config";
import { fetchContactSection } from "./contact";
import { fetchProcessPage, fetchHomepageProcess } from "./process";
import { fetchServicesSection } from "./services";
import { fetchPortfolioSection } from "./portfolio";
import { fetchTrustedBy } from "./trustedBy";
import { fetchProjectBySlug, fetchAllProjects } from "./portfolio";
import type { ProjectDetail, Project } from "./portfolio";
import {
  fetchPublishedBlogCount,
  fetchPublishedBlogPosts,
  fetchBlogPostBySlug,
} from "./blog";
import { fetchFaqSection } from "./faq";
import { fetchServiceCtaSection } from "./serviceCta";
import { fetchSiteSettings } from "./siteSettings";
import { fetchFooterData } from "./footer";
import { fetchStatsSection } from "./stats";

/** Czas życia cache w sekundach (1h). Na Vercel używa edge cache. */
const REVALIDATE = 3600;

// Pre-created cached functions to avoid creating new instances on each call
const cachedContactSectionPl = unstable_cache(
  () => fetchContactSection("pl"),
  ["contact", "pl"],
  { revalidate: REVALIDATE, tags: ["contact"] }
);

const cachedContactSectionEn = unstable_cache(
  () => fetchContactSection("en"),
  ["contact", "en"],
  { revalidate: REVALIDATE, tags: ["contact"] }
);

const cachedProcessPagePl = unstable_cache(
  () => fetchProcessPage("pl"),
  ["process-page", "pl"],
  { revalidate: REVALIDATE, tags: ["processPage"] }
);

const cachedProcessPageEn = unstable_cache(
  () => fetchProcessPage("en"),
  ["process-page", "en"],
  { revalidate: REVALIDATE, tags: ["processPage"] }
);

const cachedHomepageProcessPl = unstable_cache(
  () => fetchHomepageProcess("pl"),
  ["homepage-process", "pl"],
  { revalidate: REVALIDATE, tags: ["homepageProcess"] }
);

const cachedHomepageProcessEn = unstable_cache(
  () => fetchHomepageProcess("en"),
  ["homepage-process", "en"],
  { revalidate: REVALIDATE, tags: ["homepageProcess"] }
);

const cachedServicesSectionPl = unstable_cache(
  () => fetchServicesSection("pl"),
  ["services", "pl"],
  { revalidate: REVALIDATE, tags: ["servicesSection"] }
);

const cachedServicesSectionEn = unstable_cache(
  () => fetchServicesSection("en"),
  ["services", "en"],
  { revalidate: REVALIDATE, tags: ["servicesSection"] }
);

const cachedPortfolioSectionPl = unstable_cache(
  () => fetchPortfolioSection("pl"),
  ["portfolio", "pl"],
  { revalidate: REVALIDATE, tags: ["portfolioSection"] }
);

const cachedPortfolioSectionEn = unstable_cache(
  () => fetchPortfolioSection("en"),
  ["portfolio", "en"],
  { revalidate: REVALIDATE, tags: ["portfolioSection"] }
);

const cachedTrustedByPl = unstable_cache(
  () => fetchTrustedBy("pl"),
  ["trusted-by", "pl"],
  { revalidate: REVALIDATE, tags: ["trustedBy"] }
);

const cachedTrustedByEn = unstable_cache(
  () => fetchTrustedBy("en"),
  ["trusted-by", "en"],
  { revalidate: REVALIDATE, tags: ["trustedBy"] }
);

const cachedAllProjectsPl = unstable_cache(
  () => fetchAllProjects("pl"),
  ["projects-list", "pl"],
  { revalidate: REVALIDATE, tags: ["project"] }
);

const cachedAllProjectsEn = unstable_cache(
  () => fetchAllProjects("en"),
  ["projects-list", "en"],
  { revalidate: REVALIDATE, tags: ["project"] }
);

const cachedBlogCount = unstable_cache(
  () => fetchPublishedBlogCount(),
  ["blog-count"],
  { revalidate: REVALIDATE, tags: ["post"] }
);

const cachedBlogPostsPl = unstable_cache(
  () => fetchPublishedBlogPosts("pl"),
  ["blog-posts", "pl"],
  { revalidate: REVALIDATE, tags: ["post"] }
);

const cachedBlogPostsEn = unstable_cache(
  () => fetchPublishedBlogPosts("en"),
  ["blog-posts", "en"],
  { revalidate: REVALIDATE, tags: ["post"] }
);

const cachedFaqSectionPl = unstable_cache(
  () => fetchFaqSection("pl"),
  ["faq", "pl"],
  { revalidate: REVALIDATE, tags: ["faqSection"] }
);

const cachedFaqSectionEn = unstable_cache(
  () => fetchFaqSection("en"),
  ["faq", "en"],
  { revalidate: REVALIDATE, tags: ["faqSection"] }
);

const cachedServiceCtaSectionPl = unstable_cache(
  () => fetchServiceCtaSection("pl"),
  ["service-cta", "pl"],
  { revalidate: REVALIDATE, tags: ["serviceCta"] }
);

const cachedServiceCtaSectionEn = unstable_cache(
  () => fetchServiceCtaSection("en"),
  ["service-cta", "en"],
  { revalidate: REVALIDATE, tags: ["serviceCta"] }
);

const cachedSiteSettingsPl = unstable_cache(
  () => fetchSiteSettings("pl"),
  ["site-settings", "pl"],
  { revalidate: REVALIDATE, tags: ["siteSettings"] }
);

const cachedSiteSettingsEn = unstable_cache(
  () => fetchSiteSettings("en"),
  ["site-settings", "en"],
  { revalidate: REVALIDATE, tags: ["siteSettings"] }
);

const cachedFooterDataPl = unstable_cache(
  () => fetchFooterData("pl"),
  ["footer", "pl"],
  { revalidate: REVALIDATE, tags: ["siteSettings"] }
);

const cachedFooterDataEn = unstable_cache(
  () => fetchFooterData("en"),
  ["footer", "en"],
  { revalidate: REVALIDATE, tags: ["siteSettings"] }
);

const cachedStatsSectionPl = unstable_cache(
  () => fetchStatsSection("pl"),
  ["stats", "pl"],
  { revalidate: REVALIDATE, tags: ["statsSection"] }
);

const cachedStatsSectionEn = unstable_cache(
  () => fetchStatsSection("en"),
  ["stats", "en"],
  { revalidate: REVALIDATE, tags: ["statsSection"] }
);

// Cache for dynamic slugs (project, blog post)
const projectCache = new Map<string, ReturnType<typeof unstable_cache>>();
const blogPostCache = new Map<string, ReturnType<typeof unstable_cache>>();

function getProjectCacheKey(slug: string, lang: Language) {
  return `${slug}-${lang}`;
}

function getBlogPostCacheKey(slug: string, lang: Language) {
  return `${slug}-${lang}`;
}

// Exported functions
export async function getCachedContactSection(lang: Language) {
  return lang === "pl" ? cachedContactSectionPl() : cachedContactSectionEn();
}

export async function getCachedProcessPage(lang: Language) {
  return lang === "pl" ? cachedProcessPagePl() : cachedProcessPageEn();
}

export async function getCachedHomepageProcess(lang: Language) {
  return lang === "pl" ? cachedHomepageProcessPl() : cachedHomepageProcessEn();
}

export async function getCachedServicesSection(lang: Language) {
  return lang === "pl" ? cachedServicesSectionPl() : cachedServicesSectionEn();
}

export async function getCachedPortfolioSection(lang: Language) {
  return lang === "pl" ? cachedPortfolioSectionPl() : cachedPortfolioSectionEn();
}

export async function getCachedTrustedBy(lang: Language) {
  return lang === "pl" ? cachedTrustedByPl() : cachedTrustedByEn();
}

export async function getCachedProjectBySlug(
  slug: string,
  lang: Language
): Promise<ProjectDetail | null> {
  const key = getProjectCacheKey(slug, lang);
  let cachedFn = projectCache.get(key);
  
  if (!cachedFn) {
    cachedFn = unstable_cache(
      () => fetchProjectBySlug(slug, lang),
      ["project", slug, lang],
      { revalidate: REVALIDATE, tags: ["project", `project-${slug}`] }
    );
    projectCache.set(key, cachedFn);
  }
  
  return cachedFn();
}

export async function getCachedAllProjects(
  lang: Language
): Promise<Project[]> {
  return lang === "pl" ? cachedAllProjectsPl() : cachedAllProjectsEn();
}

export async function getCachedPublishedBlogCount(): Promise<number> {
  return cachedBlogCount();
}

export async function getCachedPublishedBlogPosts(lang: Language) {
  return lang === "pl" ? cachedBlogPostsPl() : cachedBlogPostsEn();
}

export async function getCachedBlogPostBySlug(slug: string, lang: Language) {
  const key = getBlogPostCacheKey(slug, lang);
  let cachedFn = blogPostCache.get(key);
  
  if (!cachedFn) {
    cachedFn = unstable_cache(
      () => fetchBlogPostBySlug(slug, lang),
      ["blog-post", slug, lang],
      { revalidate: REVALIDATE, tags: ["post", `post-${slug}`] }
    );
    blogPostCache.set(key, cachedFn);
  }
  
  return cachedFn();
}

export async function getCachedFaqSection(lang: Language) {
  return lang === "pl" ? cachedFaqSectionPl() : cachedFaqSectionEn();
}

export async function getCachedServiceCtaSection(lang: Language) {
  return lang === "pl" ? cachedServiceCtaSectionPl() : cachedServiceCtaSectionEn();
}

export async function getCachedSiteSettings(lang: Language) {
  return lang === "pl" ? cachedSiteSettingsPl() : cachedSiteSettingsEn();
}

export async function getCachedFooterData(lang: Language) {
  return lang === "pl" ? cachedFooterDataPl() : cachedFooterDataEn();
}

export async function getCachedStatsSection(lang: Language) {
  return lang === "pl" ? cachedStatsSectionPl() : cachedStatsSectionEn();
}
