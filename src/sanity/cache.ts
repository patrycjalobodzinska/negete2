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
import { fetchSiteSettings } from "./siteSettings";

/** Czas życia cache w sekundach (1h). Na Vercel używa edge cache. */
const REVALIDATE = 3600;

export async function getCachedContactSection(lang: Language) {
  return unstable_cache(
    () => fetchContactSection(lang),
    ["contact", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedProcessPage(lang: Language) {
  return unstable_cache(
    () => fetchProcessPage(lang),
    ["process-page", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedHomepageProcess(lang: Language) {
  return unstable_cache(
    () => fetchHomepageProcess(lang),
    ["homepage-process", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedServicesSection(lang: Language) {
  return unstable_cache(
    () => fetchServicesSection(lang),
    ["services", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedPortfolioSection(lang: Language) {
  return unstable_cache(
    () => fetchPortfolioSection(lang),
    ["portfolio", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedTrustedBy(lang: Language) {
  return unstable_cache(
    () => fetchTrustedBy(lang),
    ["trusted-by", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedProjectBySlug(
  slug: string,
  lang: Language
): Promise<ProjectDetail | null> {
  return unstable_cache(
    () => fetchProjectBySlug(slug, lang),
    ["project", slug, lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedAllProjects(
  lang: Language
): Promise<Project[]> {
  return unstable_cache(
    () => fetchAllProjects(lang),
    ["projects-list", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedPublishedBlogCount(): Promise<number> {
  return unstable_cache(
    () => fetchPublishedBlogCount(),
    ["blog-count"],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedPublishedBlogPosts(lang: Language) {
  return unstable_cache(
    () => fetchPublishedBlogPosts(lang),
    ["blog-posts", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedBlogPostBySlug(slug: string, lang: Language) {
  return unstable_cache(
    () => fetchBlogPostBySlug(slug, lang),
    ["blog-post", slug, lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedFaqSection(lang: Language) {
  return unstable_cache(
    () => fetchFaqSection(lang),
    ["faq", lang],
    { revalidate: REVALIDATE }
  )();
}

export async function getCachedSiteSettings(lang: Language) {
  return unstable_cache(
    () => fetchSiteSettings(lang),
    ["site-settings", lang],
    { revalidate: REVALIDATE }
  )();
}
