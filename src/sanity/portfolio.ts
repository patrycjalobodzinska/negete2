import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";
import type { Language } from "@/i18n/config";
import { urlFor } from "./image";

const CATEGORY_LABELS: Record<string, { pl: string; en: string }> = {
  "elektronika-pcb": { pl: "Elektronika & PCB", en: "Electronics & PCB" },
  "firmware-embedded": { pl: "Firmware & Embedded", en: "Firmware & Embedded" },
  "mechanika-wzornictwo": { pl: "Mechanika & Wzornictwo", en: "Mechanics & Design" },
  "iot-automatyka": { pl: "IoT & Automatyka", en: "IoT & Automation" },
  "medycyna": { pl: "Medycyna & Sprzęt Medyczny", en: "Medical & Medical Equipment" },
  "motoryzacja": { pl: "Motoryzacja", en: "Automotive" },
  "wearables": { pl: "Wearables", en: "Wearables" },
  "inne": { pl: "Inne", en: "Other" },
};

function getCategoryLabel(
  category?: string,
  customCategory?: string,
  lang: Language = "pl"
): string | undefined {
  if (customCategory) return customCategory;
  if (category && CATEGORY_LABELS[category]) {
    return CATEGORY_LABELS[category][lang];
  }
  return undefined;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  image: string;
  imageAlt?: string;
  gridSpan: string;
  description?: string;
  category?: string;
  categoryLabel?: string;
}

export interface PortfolioSection {
  _id: string;
  heading: string;
  description?: string;
  projects: Project[];
}

interface ProjectRaw {
  _id: string;
  titlePl?: string;
  titleEn?: string;
  slug?: {
    current?: string;
  };
  mainImage?: SanityImageSource & {
    altPl?: string;
    altEn?: string;
  };
  gridSpan?: string;
  descriptionPl?: string;
  descriptionEn?: string;
  category?: string;
  customCategory?: string;
  sections?: any[];
  gallery?: Array<SanityImageSource & {
    altPl?: string;
    altEn?: string;
  }>;
  publishedAt?: string;
  seo?: {
    metaTitlePl?: string;
    metaTitleEn?: string;
    metaDescriptionPl?: string;
    metaDescriptionEn?: string;
    ogImage?: SanityImageSource;
  };
}

interface PortfolioSectionRaw {
  _id: string;
  headingPl?: string;
  headingEn?: string;
  descriptionPl?: string;
  descriptionEn?: string;
  projects?: ProjectRaw[];
}

/**
 * Pobiera z Sanity dokument typu `portfolioSection` z tłumaczeniami.
 * Zakłada, że istnieje jeden główny dokument tej sekcji (bierze pierwszy z listy).
 * @param lang - Język, w którym mają być zwrócone dane ('pl' lub 'en')
 */
export async function fetchPortfolioSection(
  lang: Language = "pl"
): Promise<PortfolioSection | null> {
  const query = `
    *[_type == "portfolioSection"][0]{
      _id,
      headingPl,
      headingEn,
      descriptionPl,
      descriptionEn,
      projects[]->{
        _id,
        titlePl,
        titleEn,
        slug,
        mainImage{
          ...,
          altPl,
          altEn
        },
        gridSpan,
        descriptionPl,
        descriptionEn,
        category,
        customCategory
      }
    }
  `;

  const data = await sanityClient.fetch<PortfolioSectionRaw | null>(query);

  if (!data) {
    return null;
  }

  // Mapuj dane wielojęzyczne na dane dla wybranego języka
  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";
  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const projectDescriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";

  const altKey = lang === "pl" ? "altPl" : "altEn";

  const projects: Project[] =
    data.projects?.map((project) => {
      const categoryLabel = getCategoryLabel(project.category, project.customCategory, lang);
      return {
        _id: project._id,
        title: project[titleKey] || project.titlePl || "",
        slug: project.slug?.current || "",
        image: project.mainImage
          ? urlFor(project.mainImage).width(800).height(600).url()
          : "",
        imageAlt: project.mainImage?.[altKey] || project.mainImage?.altPl || "",
        gridSpan: project.gridSpan || "md:col-span-1 md:row-span-1",
        description: project[projectDescriptionKey] || project.descriptionPl,
        category: project.customCategory || project.category,
        categoryLabel,
      };
    }) || [];

  return {
    _id: data._id,
    heading: data[headingKey] || data.headingPl || "",
    description: data[descriptionKey] || data.descriptionPl,
    projects,
  };
}

export interface ProjectSection {
  _type: string;
  [key: string]: any;
}

export interface ProjectSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface ProjectDetail extends Project {
  sections?: ProjectSection[];
  publishedAt?: string;
  seo?: ProjectSeo;
}

/**
 * Pobiera pojedynczy projekt po slug (dla podstrony projektu)
 * @param slug - Slug projektu
 * @param lang - Język, w którym mają być zwrócone dane ('pl' lub 'en')
 */
export async function fetchProjectBySlug(
  slug: string,
  lang: Language = "pl"
): Promise<ProjectDetail | null> {
  const query = `
    *[_type == "project" && slug.current == $slug][0]{
      _id,
      titlePl,
      titleEn,
      slug,
      mainImage{
        ...,
        altPl,
        altEn
      },
      gridSpan,
      descriptionPl,
      descriptionEn,
      category,
      customCategory,
      sections[]{
        _type,
        _type == "heroSection" => {
          titlePl,
          titleEn,
          subtitlePl,
          subtitleEn,
          backgroundImage{
            ...,
            altPl,
            altEn
          }
        },
        _type == "descriptionSection" => {
          contentPl,
          contentEn
        },
        _type == "gallerySection" => {
          titlePl,
          titleEn,
          images[]{
            ...,
            altPl,
            altEn
          }
        },
        _type == "specsSection" => {
          titlePl,
          titleEn,
          specs[]{
            labelPl,
            labelEn,
            valuePl,
            valueEn
          }
        },
        _type == "featuresSection" => {
          titlePl,
          titleEn,
          features[]{
            titlePl,
            titleEn,
            descriptionPl,
            descriptionEn,
            icon
          }
        },
        _type == "imageGridSection" => {
          titlePl,
          titleEn,
          items[]{
            image{
              ...,
              altPl,
              altEn
            },
            titlePl,
            titleEn,
            descriptionPl,
            descriptionEn
          }
        }
      },
      publishedAt,
      seo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } }
    }
  `;

  const data = await sanityClient.fetch<ProjectRaw | null>(query, { slug });

  if (!data) {
    return null;
  }

  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";
  const altKey = lang === "pl" ? "altPl" : "altEn";

  const categoryLabel = getCategoryLabel(data.category, data.customCategory, lang);

  // Mapuj sekcje na odpowiedni język
  const mappedSections = data.sections?.map((section: any) => {
    const mapped: any = { _type: section._type };

    if (section._type === "heroSection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.subtitle = section[lang === "pl" ? "subtitlePl" : "subtitleEn"] || section.subtitlePl;
      if (section.backgroundImage) {
        mapped.backgroundImage = {
          url: urlFor(section.backgroundImage).width(1920).height(1080).fit('clip').url(),
          alt: section.backgroundImage[altKey] || section.backgroundImage.altPl || "",
        };
      }
    } else if (section._type === "descriptionSection") {
      mapped.content = section[lang === "pl" ? "contentPl" : "contentEn"] || section.contentPl;
    } else if (section._type === "gallerySection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.images = section.images?.map((img: any) => ({
        url: urlFor(img).width(1200).url(),
        alt: img[altKey] || img.altPl || "",
      }));
    } else if (section._type === "specsSection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.specs = section.specs?.map((spec: any) => ({
        label: spec[lang === "pl" ? "labelPl" : "labelEn"] || spec.labelPl,
        value: spec[lang === "pl" ? "valuePl" : "valueEn"] || spec.valuePl,
      }));
    } else if (section._type === "featuresSection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.features = section.features?.map((feature: any) => ({
        title: feature[titleKey] || feature.titlePl,
        description: feature[lang === "pl" ? "descriptionPl" : "descriptionEn"] || feature.descriptionPl,
        icon: feature.icon,
      }));
    } else if (section._type === "imageGridSection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.items = section.items?.map((item: any) => ({
        image: item.image
          ? {
              url: urlFor(item.image).width(800).height(600).url(),
              alt: item.image[altKey] || item.image.altPl || "",
            }
          : null,
        title: item[titleKey] || item.titlePl,
        description: item[lang === "pl" ? "descriptionPl" : "descriptionEn"] || item.descriptionPl,
      }));
    }

    return mapped;
  });

  const seoRaw = data.seo;
  const seo: ProjectSeo | undefined = seoRaw
    ? {
        metaTitle:
          (lang === "pl" ? seoRaw.metaTitlePl : seoRaw.metaTitleEn) ||
          seoRaw.metaTitlePl,
        metaDescription:
          (lang === "pl" ? seoRaw.metaDescriptionPl : seoRaw.metaDescriptionEn) ||
          seoRaw.metaDescriptionPl,
        ogImage: seoRaw.ogImage
          ? urlFor(seoRaw.ogImage).width(1200).height(630).fit("clip").url()
          : undefined,
      }
    : undefined;

  return {
    _id: data._id,
    title: data[titleKey] || data.titlePl || "",
    slug: data.slug?.current || "",
    image: data.mainImage
      ? urlFor(data.mainImage).width(1200).height(800).fit('clip').url()
      : "",
    imageAlt: data.mainImage?.[altKey] || data.mainImage?.altPl || "",
    gridSpan: data.gridSpan || "md:col-span-1 md:row-span-1",
    description: data[descriptionKey] || data.descriptionPl,
    category: data.customCategory || data.category,
    categoryLabel,
    sections: mappedSections,
    publishedAt: data.publishedAt,
    seo,
  };
}

/**
 * Pobiera wszystkie projekty (dla przyszłej strony z listą wszystkich realizacji)
 * @param lang - Język, w którym mają być zwrócone dane ('pl' lub 'en')
 */
export async function fetchAllProjects(
  lang: Language = "pl"
): Promise<Project[]> {
  const query = `
    *[_type == "project"] | order(publishedAt desc){
      _id,
      titlePl,
      titleEn,
      slug,
      mainImage{
        ...,
        altPl,
        altEn
      },
      gridSpan,
      descriptionPl,
      descriptionEn,
      category,
      customCategory,
      publishedAt
    }
  `;

  const data = await sanityClient.fetch<ProjectRaw[]>(query);

  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";
  const altKey = lang === "pl" ? "altPl" : "altEn";

  return data.map((project) => {
    const categoryLabel = getCategoryLabel(project.category, project.customCategory, lang);
    return {
      _id: project._id,
      title: project[titleKey] || project.titlePl || "",
      slug: project.slug?.current || "",
      image: project.mainImage
        ? urlFor(project.mainImage).width(800).height(600).url()
        : "",
      imageAlt: project.mainImage?.[altKey] || project.mainImage?.altPl || "",
      gridSpan: project.gridSpan || "md:col-span-1 md:row-span-1",
      description: project[descriptionKey] || project.descriptionPl,
      category: project.customCategory || project.category,
      categoryLabel,
    };
  });
}
