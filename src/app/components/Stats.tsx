"use client";

import { useEffect, useState } from "react";
import { fetchStatsSection, type StatsSection } from "@/sanity/stats";
import type { Language } from "@/i18n/config";

interface StatsProps {
  lang?: Language;
  initialData?: StatsSection | null;
}

export default function Stats({ lang = "pl", initialData }: StatsProps) {
  const [data, setData] = useState<StatsSection | null>(initialData ?? null);

  useEffect(() => {
    if (initialData) return;
    fetchStatsSection(lang)
      .then((d) => d && setData(d))
      .catch((err) =>
        console.error("Błąd pobierania sekcji statystyk z Sanity:", err),
      );
  }, [lang, initialData]);

  const items = data?.items ?? [];

  if (!items.length) return null;
  const orbitronStyle = { fontFamily: "var(--font-orbitron), sans-serif" };

  return (
    <section
      data-section="stats"
      className="relative py-8 md:py-12 px-2"
      aria-label="Statystyki">
      <div className="max-w-7xl mx-auto">
        <div
          className="flex md:divide-x md:divide-cyan-400/40 flex-wrap items-baseline justify-center text-center"
          style={orbitronStyle}>
          {items.map((item, index) => (
            <span
              key={index}
              className="px-4 my-3 gap-3 inline-flex items-baseline ">
              <span
                className="tabular-nums text-2xl sm:text-3xl md:text-3xl font-semibold text-cyan-400"
                style={{
                  textShadow: "0 0 20px rgba(34, 211, 238, 0.4)",
                }}>
                {item.value}
              </span>
              <span className="text-base md:text-base font-normal text-white/70 tracking-wide">
                {item.label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
