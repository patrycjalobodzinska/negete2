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

export async function getCachedContactSection(lang: Language) {
  return unstable_cache(
    () => fetchContactSection(lang),
    ["contact", lang],
    { revalidate: REVALIDATE, tags: ["contact"] }
  )();
}

export async function getCachedProcessPage(lang: Language) {
  return unstable_cache(
    () => fetchProcessPage(lang),
    ["process-page", lang],
    { revalidate: REVALIDATE, tags: ["processPage"] }
  )();
}

export async function getCachedHomepageProcess(lang: Language) {
  return unstable_cache(
    () => fetchHomepageProcess(lang),
    ["homepage-process", lang],
    { revalidate: REVALIDATE, tags: ["homepageProcess"] }
  )();
}

export async function getCachedServicesSection(lang: Language) {
  return unstable_cache(
    () => fetchServicesSection(lang),
    ["services", lang],
    { revalidate: REVALIDATE, tags: ["servicesSection"] }
  )();
}

export async function getCachedPortfolioSection(lang: Language) {
  return unstable_cache(
    () => fetchPortfolioSection(lang),
    ["portfolio", lang],
    { revalidate: REVALIDATE, tags: ["portfolioSection"] }
  )();
}

export async function getCachedTrustedBy(lang: Language) {
  return unstable_cache(
    () => fetchTrustedBy(lang),
    ["trusted-by", lang],
    { revalidate: REVALIDATE, tags: ["trustedBy"] }
  )();
}

export async function getCachedProjectBySlug(
  slug: string,
  lang: Language
): Promise<ProjectDetail | null> {
  return unstable_cache(
    () => fetchProjectBySlug(slug, lang),
    ["project", slug, lang],
    { revalidate: REVALIDATE, tags: ["project", `project-${slug}`] }
  )();
}

export async function getCachedAllProjects(
  lang: Language
): Promise<Project[]> {
  return unstable_cache(
    () => fetchAllProjects(lang),
    ["projects-list", lang],
    { revalidate: REVALIDATE, tags: ["project"] }
  )();
}

export async function getCachedPublishedBlogCount(): Promise<number> {
  return unstable_cache(
    () => fetchPublishedBlogCount(),
    ["blog-count"],
    { revalidate: REVALIDATE, tags: ["post"] }
  )();
}

export async function getCachedPublishedBlogPosts(lang: Language) {
  return unstable_cache(
    () => fetchPublishedBlogPosts(lang),
    ["blog-posts", lang],
    { revalidate: REVALIDATE, tags: ["post"] }
  )();
}

export async function getCachedBlogPostBySlug(slug: string, lang: Language) {
  return unstable_cache(
    () => fetchBlogPostBySlug(slug, lang),
    ["blog-post", slug, lang],
    { revalidate: REVALIDATE, tags: ["post", `post-${slug}`] }
  )();
}

export async function getCachedFaqSection(lang: Language) {
  return unstable_cache(
    () => fetchFaqSection(lang),
    ["faq", lang],
    { revalidate: REVALIDATE, tags: ["faqSection"] }
  )();
}

export async function getCachedServiceCtaSection(lang: Language) {
  return unstable_cache(
    () => fetchServiceCtaSection(lang),
    ["service-cta", lang],
    { revalidate: REVALIDATE, tags: ["serviceCta"] }
  )();
}

export async function getCachedSiteSettings(lang: Language) {
  return unstable_cache(
    () => fetchSiteSettings(lang),
    ["site-settings", lang],
    { revalidate: REVALIDATE, tags: ["siteSettings"] }
  )();
}

export async function getCachedFooterData(lang: Language) {
  return unstable_cache(
    () => fetchFooterData(lang),
    ["footer", lang],
    { revalidate: REVALIDATE, tags: ["siteSettings"] }
  )();
}

export async function getCachedStatsSection(lang: Language) {
  return unstable_cache(
    () => fetchStatsSection(lang),
    ["stats", lang],
    { revalidate: REVALIDATE, tags: ["statsSection"] }
  )();
}
