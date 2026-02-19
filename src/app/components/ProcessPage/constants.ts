import type React from "react";
import * as LucideIcons from "lucide-react";
import type { ProcessSection } from "@/sanity/process";

export const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Search: LucideIcons.Search,
  Layers: LucideIcons.Layers,
  Box: LucideIcons.Box,
  Factory: LucideIcons.Factory,
  Cpu: LucideIcons.Cpu,
  Code: LucideIcons.Code,
  Zap: LucideIcons.Zap,
  Award: LucideIcons.Award,
};

export const PATH_D =
  "M 200 160 L 600 160" +  // Linia pozioma (dawny border hero)
  " C 600 160, 500 200, 400 280" + // Lagodne przejscie w dol
  " C 400 340, 120 420, 60 580" +
  " C 0 740, 120 800, 350 840" +
  " C 580 880, 780 940, 760 1100" +
  " C 740 1260, 480 1300, 280 1340" +
  " C 80 1380, 20 1460, 80 1600" +
  " C 140 1740, 400 1780, 500 1840" +
  " C 600 1900, 620 2000, 540 2120" +
  " C 460 2240, 300 2360, 300 2480" +
  " C 300 2600, 400 2720, 350 2900" +
  " C 300 3080, 200 3200, 400 3350";

export const PATH_D_MOBILE =
  "M 200 220" +
  " C 50 450, 350 700, 200 950" +
  " C 50 1200, 350 1450, 200 1700" +
  " C 50 1950, 350 2200, 200 2400" +
  " C 200 2600, 50 2800, 200 3000" +
  " C 350 3200, 200 3400, 200 3600";

export const FALLBACK_STEPS: ProcessSection[] = [
  {
    id: 0,
    title: "Analiza potrzeb",
    description:
      "Zaczynamy od dogłębnego zrozumienia Twojego biznesu, celów i grupy docelowej.",
    color: "#00f0ff",
    details: [],
  },
  {
    id: 1,
    title: "Strategia i planowanie",
    description: "Tworzymy kompleksową strategię działania i mierzalne cele.",
    color: "#00f0ff",
    details: [],
  },
  {
    id: 2,
    title: "Realizacja projektu",
    description: "Realizujemy projekt etapami, dbając o jakość i terminowość.",
    color: "#00f0ff",
    details: [],
  },
  {
    id: 3,
    title: "Optymalizacja i rozwój",
    description: "Wprowadzamy ulepszenia i skalujemy rozwiązania.",
    color: "#00f0ff",
    details: [],
  },
];

export const IMG_TOPS = ["18%", "36%", "54%", "70%", "85%"];
export const CARD_TOPS = ["16%", "34%", "52%", "72%", "82%"];
