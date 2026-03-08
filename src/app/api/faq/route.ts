import { getCachedFaqSection } from "@/sanity/cache";
import type { Language } from "@/i18n/config";

const MAX_FAQ_IN_FOOTER = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "pl") as Language;
  const faq = await getCachedFaqSection(lang);
  const items = (faq?.items ?? [])
    .slice(0, MAX_FAQ_IN_FOOTER)
    .map((item) => ({ id: item.id, question: item.question }));
  return Response.json({ items });
}
