"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { languages, languageNames, type Language } from "@/i18n/config";

export function LanguageSwitcher() {
  const pathname = usePathname();

  // Wyciągnij język z pathname
  const getCurrentLang = (): Language => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && languages.includes(segments[0] as Language)) {
      return segments[0] as Language;
    }
    return "pl"; // domyślnie polski
  };

  const currentLang = getCurrentLang();

  // Utwórz ścieżkę dla każdego języka
  const getLangPath = (lang: Language): string => {
    if (lang === "pl") {
      // Dla polskiego usuń prefiks języka z pathname
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0 && languages.includes(segments[0] as Language)) {
        return "/" + segments.slice(1).join("/") || "/";
      }
      return pathname;
    } else {
      // Dla angielskiego dodaj prefiks /en
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0 && languages.includes(segments[0] as Language)) {
        return `/en/${segments.slice(1).join("/")}`;
      }
      return `/en${pathname === "/" ? "" : pathname}`;
    }
  };

  return (
    <nav className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
      {languages.map((lng) => (
        <Link
          key={lng}
          href={getLangPath(lng)}
          className={`rounded-full px-3 py-1 border ${
            lng === currentLang
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          }`}
        >
          {languageNames[lng]}
        </Link>
      ))}
    </nav>
  );
}
