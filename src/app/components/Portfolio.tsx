"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  fetchAllProjects,
  type Project,
} from "@/sanity/portfolio";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import type { Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";
import { ThreeDMarquee } from "./ui/3d-marquee";

interface PortfolioProps {
  lang?: Language;
  initialData?: Project[] | null;
  heading?: string;
  description?: string;
}

export default function Portfolio({
  lang: langProp,
  initialData,
  heading,
  description,
}: PortfolioProps) {
  const { lang, getPath } = useLocalizedPath(langProp);
  const [projects, setProjects] = useState<Project[]>(
    initialData ?? [],
  );

  useEffect(() => {
    // Skip fetch only if we have valid initialData passed from server
    if (initialData && initialData.length > 0) return;
    fetchAllProjects(lang)
      .then((data) => data && setProjects(data))
      .catch((err) =>
        console.error("Błąd pobierania projektów z Sanity:", err),
      );
  }, [lang, initialData]);

  if (!projects?.length) return null;

  const projectsWithImages = projects.filter(
    (p) => p.image && String(p.image).trim(),
  );

  const baseItems = projectsWithImages.map((p) => ({
    image: p.image,
    slug: p.slug,
    title: p.title,
    isPortrait: p.isPortrait ?? false,
  }));

  if (baseItems.length === 0) return null;

  const targetCount = 56;
  const numCols = 4;
  const numRows = Math.ceil(targetCount / numCols);
  // Każda kolumna ma mix bez powtórzeń jedna pod drugą (round-robin w kolumnie)
  const columns: (typeof baseItems)[] = [[], [], [], []];
  for (let c = 0; c < numCols; c++) {
    let prevIndex = (c + baseItems.length - 1) % baseItems.length;
    for (let r = 0; r < numRows; r++) {
      const nextIndex = (prevIndex + 1) % baseItems.length;
      columns[c].push(baseItems[nextIndex]);
      prevIndex = nextIndex;
    }
  }
  const items = Array.from(
    { length: targetCount },
    (_, i) => columns[i % numCols][Math.floor(i / numCols)],
  );

  const defaultHeading = lang === "pl" ? "Nasze realizacje" : "Our Projects";

  return (
    <section data-section="portfolio" className="relative md:py-32 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center flex justify-between ">
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight mb-4">
            {heading || defaultHeading}
          </h2>

          <Link href={getPath("/realizacje")} className="group inline-block">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-6 py-3 text-cyan-400 font-medium transition-colors hover:border-cyan-400/70 hover:bg-cyan-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              {t(lang, "portfolio.seeMore")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 " />
            </motion.span>
          </Link>
        </div>
        {description && <div className="text-gray-300">{description}</div>}

        <div className="mx-auto my-10 max-w-7xl rounded-3xl shadow-[0_0_25px_rgba(59,130,246,0.25),0_0_50px_rgba(59,130,246,0.1)]">
          <ThreeDMarquee
            items={items}
            getHref={(slug) => getPath(`/realizacje/${slug}`)}
          />
        </div>
      </div>
    </section>
  );
}
