"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { languages, languageNames, type Language } from "@/i18n/config";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ variant = "navbar" }: { variant?: "navbar" | "footer" }) {
  const pathname = usePathname() ?? "";

  const getCurrentLang = (): Language => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && languages.includes(segments[0] as Language)) {
      return segments[0] as Language;
    }
    return "pl";
  };

  const currentLang = getCurrentLang();

  const getLangPath = (lang: Language): string => {
    const segments = pathname.split("/").filter(Boolean);
    const isLangInPath =
      segments.length > 0 && languages.includes(segments[0] as Language);
    const restPath = isLangInPath ? segments.slice(1).join("/") : segments.join("/");

    if (lang === "pl") {
      return restPath ? `/pl/${restPath}` : "/";
    }
    return restPath ? `/en/${restPath}` : "/en";
  };

  const isNavbar = variant === "navbar";

  return (
    <nav
      aria-label={currentLang === "pl" ? "Wybierz język" : "Choose language"}
      className="flex items-center gap-2"
    >

      <div className="flex rounded-full border border-white/20 bg-black/20 p-0.5">
        {languages.map((lng) => {
          const isActive = lng === currentLang;
          return (
            <Link
              key={lng}
              href={getLangPath(lng)}
              lang={lng}
              hrefLang={lng}
              aria-current={isActive ? "page" : undefined}
              className={`
                relative rounded-full px-3 py-1.5 text-sm font-medium
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                ${isNavbar ? "min-w-12" : ""}
                ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/40"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }
              `}
            >
              {languageNames[lng]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
