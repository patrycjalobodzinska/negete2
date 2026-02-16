"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { languages, type Language } from "@/i18n/config";

function getLangFromPathname(pathname: string): Language {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && languages.includes(segments[0] as Language)) {
    return segments[0] as Language;
  }
  return "pl";
}

export function useLocalizedPath(langOverride?: Language) {
  const pathname = usePathname();
  const lang = langOverride ?? getLangFromPathname(pathname ?? "");

  const getPath = useCallback(
    (path: string) => {
      if (path === "/") {
        return lang === "pl" ? "/" : `/${lang}`;
      }
      return `/${lang}${path}`;
    },
    [lang]
  );

  return { lang, getPath };
}
