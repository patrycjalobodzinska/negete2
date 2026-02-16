import { servicesSection } from "./schemaTypes/servicesSection";
import { project } from "./schemaTypes/project";
import { portfolioSection } from "./schemaTypes/portfolioSection";
import { homepageProcess } from "./schemaTypes/homepageProcess";
import { processPage } from "./schemaTypes/processPage";
import { trustedBy } from "./schemaTypes/trustedBy";
import { contactSection } from "./schemaTypes/contactSection";
import { blogPost } from "./schemaTypes/blogPost";
import { faqSection } from "./schemaTypes/faqSection";
import { seoFields } from "./schemaTypes/seoFields";
import { siteSettings } from "./schemaTypes/siteSettings";

export const schemaTypes = [
  seoFields,
  siteSettings,
  servicesSection,
  project,
  portfolioSection,
  homepageProcess,
  processPage,
  trustedBy,
  contactSection,
  blogPost,
  faqSection,
];
