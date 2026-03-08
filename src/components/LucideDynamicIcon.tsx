"use client";

import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import { Cpu } from "lucide-react";

/** Zamiana nazwy z Sanity (PascalCase lub kebab-case) na klucz z Lucide (kebab-case). */
function toKebab(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const withHyphens = trimmed
    .replace(/([A-Z])/g, (_, c: string) => "-" + c.toLowerCase())
    .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
    .replace(/^-/, "");
  return withHyphens.toLowerCase();
}

/** Sprawdza, czy nazwa jest w oficjalnej liście Lucide (po konwersji do kebab). */
export function isValidLucideIconName(name: string): boolean {
  const kebab = toKebab(name);
  return kebab.length > 0 && (iconNames as readonly string[]).includes(kebab);
}

/** Lista wszystkich nazw ikon (kebab-case) – do dropdownu w Sanity lub podpowiedzi. */
export const LUCIDE_ICON_NAMES = iconNames as readonly string[];

type Props = {
  /** Nazwa ikony z Sanity: PascalCase (np. Cpu, FileCode) lub kebab-case (np. cpu, file-code). */
  iconKey: string | null | undefined;
  /** Klasy CSS (np. w-6 h-6 text-cyan-400). */
  className?: string;
  /** Rozmiar w px. */
  size?: number;
  [key: string]: unknown;
};

/**
 * Renderuje dowolną ikonę z Lucide po nazwie z Sanity.
 * Klient może wybrać każdą ikonę z https://lucide.dev/icons/ – nazwa w PascalCase lub kebab-case.
 */
export default function LucideDynamicIcon({
  iconKey,
  className,
  size,
  ...rest
}: Props) {
  const raw = (iconKey ?? "").trim();
  const kebab = toKebab(raw);
  const fallbackKebab = raw.toLowerCase().replace(/\s+/g, "-");
  const iconNamesList = iconNames as readonly string[];
  const name = iconNamesList.includes(kebab)
    ? kebab
    : iconNamesList.includes(fallbackKebab)
      ? fallbackKebab
      : "";

  if (!name) {
    return <Cpu className={className} size={size} {...rest} />;
  }

  return (
    <DynamicIcon
      name={name as Parameters<typeof DynamicIcon>[0]["name"]}
      className={className}
      size={size}
      fallback={() => <Cpu className={className} size={size} {...rest} />}
      {...rest}
    />
  );
}
