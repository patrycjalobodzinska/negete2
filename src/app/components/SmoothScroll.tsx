"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Opakowuje treść i przewija do góry przy każdej zmianie trasy.
 * Wyłącza przywracanie pozycji scrolla przez przeglądarkę (np. po odświeżeniu).
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // Użyj tylko jednego scrollTo dla lepszej wydajności
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <>{children}</>;
}
