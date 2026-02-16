"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useRef, useState, useEffect } from "react";
import {
  fetchHomepageProcess,
  type HomepageProcess,
  type ProcessGroup,
} from "@/sanity/process";
import type { Language } from "@/i18n/config";

// Mapowanie ikon z lucide-react
const ICONS: Record<string, React.ComponentType<any>> = {
  Search: LucideIcons.Search,
  Layers: LucideIcons.Layers,
  Box: LucideIcons.Box,
  Factory: LucideIcons.Factory,
  Cpu: LucideIcons.Cpu,
  Code: LucideIcons.Code,
  Zap: LucideIcons.Zap,
  Award: LucideIcons.Award,
  // Dodaj więcej ikon według potrzeb
} as any;

// Fallback dane
const FALLBACK_STEPS: ProcessGroup[] = [
  {
    id: 0,
    title: "Analiza",
    shortTitle: "Analiza",
    description: "Weryfikujemy Twój pomysł i budżet",
    icon: "Search",
    details: [
      "Szczegółowa analiza wymagań technicznych",
      "Ocena wykonalności projektu",
      "Wstępna wycena i timeline",
      "Rekomendacje technologiczne",
    ],
    color: "#00f0ff",
  },
  {
    id: 1,
    title: "Projekt",
    shortTitle: "Projekt",
    description: "Tworzymy elektronikę, mechanikę i kod",
    icon: "Layers",
    details: [
      "Projektowanie schematów i PCB",
      "Opracowanie oprogramowania embedded",
      "Projekt mechaniczny i obudowy",
      "Dokumentacja techniczna",
    ],
    color: "#0099ff",
  },
  {
    id: 2,
    title: "Prototyp",
    shortTitle: "Prototyp",
    description: "Budujemy i testujemy fizyczny model",
    icon: "Box",
    details: [
      "Produkcja prototypowej płytki PCB",
      "Druk 3D obudów i elementów",
      "Montaż i programowanie",
      "Testy funkcjonalne i walidacja",
    ],
    color: "#0066ff",
  },
  {
    id: 3,
    title: "Produkcja",
    shortTitle: "Produkcja",
    description: "Wdrażamy produkt i certyfikację",
    icon: "Factory",
    details: [
      "Optymalizacja dla produkcji masowej",
      "Certyfikacja CE, EMC/EMI",
      "Nadzór nad produkcją seryjną",
      "Wsparcie techniczne po wdrożeniu",
    ],
    color: "#0044ff",
  },
];

const steps = [
  {
    id: 0,
    title: "Analiza",
    shortTitle: "Analiza",
    description: "Weryfikujemy Twój pomysł i budżet",
    icon: LucideIcons.Search,
    details: [
      "Szczegółowa analiza wymagań technicznych",
      "Ocena wykonalności projektu",
      "Wstępna wycena i timeline",
      "Rekomendacje technologiczne",
    ],
    color: "#00f0ff",
  },
  {
    id: 1,
    title: "Projekt",
    shortTitle: "Projekt",
    description: "Tworzymy elektronikę, mechanikę i kod",
    icon: LucideIcons.Layers,
    details: [
      "Projektowanie schematów i PCB",
      "Opracowanie oprogramowania embedded",
      "Projekt mechaniczny i obudowy",
      "Dokumentacja techniczna",
    ],
    color: "#0099ff",
  },
  {
    id: 2,
    title: "Prototyp",
    shortTitle: "Prototyp",
    description: "Budujemy i testujemy fizyczny model",
    icon: LucideIcons.Box,
    details: [
      "Produkcja prototypowej płytki PCB",
      "Druk 3D obudów i elementów",
      "Montaż i programowanie",
      "Testy funkcjonalne i walidacja",
    ],
    color: "#0066ff",
  },
  {
    id: 3,
    title: "Produkcja",
    shortTitle: "Produkcja",
    description: "Wdrażamy produkt i certyfikację",
    icon: LucideIcons.Factory,
    details: [
      "Optymalizacja dla produkcji masowej",
      "Certyfikacja CE, EMC/EMI",
      "Nadzór nad produkcją seryjną",
      "Wsparcie techniczne po wdrożeniu",
    ],
    color: "#0044ff",
  },
];

interface ProcessProps {
  lang?: Language;
  initialData?: HomepageProcess | null;
}

export default function Process({
  lang = "pl",
  initialData,
}: ProcessProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [processData, setProcessData] = useState<HomepageProcess | null>(
    initialData ?? null
  );

  useEffect(() => {
    if (initialData) return;
    fetchHomepageProcess(lang).then((data) => setProcessData(data));
  }, [lang, initialData]);

  const steps = processData?.groups || FALLBACK_STEPS;
  const heading = processData?.heading || "Nasz proces";
  const subtitle = processData?.subtitle || "Od pomysłu do produkcji";

  // Użyj useScroll - Lenis działa z natywnym scroll, więc framer-motion powinien działać
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Animacja linii PCB - płynie w dół podczas scrollowania
  const lineProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Tło PCB */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern
              id="pcb-grid"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="#00f0ff" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pcb-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Nagłówek */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
            {heading}
          </h2>
          <p className="text-xl text-gray-400">{subtitle}</p>
        </motion.div>

        {/* Pionowa linia PCB */}
        <div className="relative max-w-4xl mx-auto">
          {/* Linia tła */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-transparent via-gray-700 to-transparent z-0" />

          {/* Animowana linia z sygnałem */}
          <motion.div
            className="absolute left-1/2 top-0 w-1 -translate-x-1/2 origin-top z-0"
            style={{
              height: lineProgress,
              background: `linear-gradient(to bottom, ${steps[0].color}, ${
                steps[steps.length - 1].color
              })`,
              boxShadow: `0 0 20px ${steps[0].color}40`,
            }}
          />

          {/* Kroki procesu */}
          <div className="relative space-y-16 sm:space-y-24 md:space-y-32">
            {steps.map((step, index) => {
              const IconComponent = step.icon && ICONS[step.icon] ? ICONS[step.icon] : ICONS.Search;
              const stepRef = useRef<HTMLDivElement>(null);

              // Użyj useScroll - Lenis działa z natywnym scroll
              const { scrollYProgress: stepProgress } = useScroll({
                target: stepRef,
                offset: ["start 0.7", "end 0.3"],
              });

              const opacity = useTransform(
                stepProgress,
                [0, 0.5, 1],
                [0.3, 1, 1]
              );
              const scale = useTransform(
                stepProgress,
                [0, 0.5, 1],
                [0.9, 1, 1]
              );
              const y = useTransform(stepProgress, [0, 0.5, 1], [30, 0, 0]);

              // Sprawdź czy krok jest aktywny (w centrum widoku)
              const [isActive, setIsActive] = useState(false);

              useMotionValueEvent(stepProgress, "change", (latest) => {
                setIsActive(latest >= 0.4 && latest <= 0.6);
              });

              return (
                <motion.div
                  key={step.id}
                  ref={stepRef}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}>
                  {/* Węzeł na linii – na mobile nad kartą (solid bg zasłania linię) */}
                  <div className="flex-shrink-0 md:bg-transparent bg-black/95 rounded-2xl  relative z-10">
                    <motion.div
                      className="relative w-24 h-24 rounded-2xl flex items-center justify-center border-2"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}30, ${step.color}15), #050A14`,
                        borderColor: step.color,
                        opacity,
                        scale,
                        boxShadow: `0 0 30px ${step.color}60`,
                      }}>
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{ border: `2px solid ${step.color}` }}
                        animate={
                          isActive
                            ? {
                                scale: [1, 1.2, 1],
                                opacity: [1, 0, 1],
                              }
                            : {
                                scale: 1,
                                opacity: 1,
                              }
                        }
                        transition={{
                          duration: 2,
                          repeat: isActive ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        animate={
                          isActive
                            ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }
                            : {
                                scale: 1,
                                rotate: 0,
                              }
                        }
                        transition={{
                          duration: 2,
                          repeat: isActive ? Infinity : 0,
                          ease: "easeInOut",
                        }}>
                        <IconComponent
                          className="w-12 h-12"
                          style={{
                            color: step.color,
                            filter: `drop-shadow(0 0 8px ${step.color})`,
                          }}
                        />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold"
                      style={{
                        color: step.color,
                        opacity,
                      }}>
                      {step.shortTitle}
                    </motion.div>
                  </div>

                  {/* Karta z detalami */}
                  <motion.div
                    className="flex-1 w-full min-w-0 relative z-20"
                    style={{
                      y,
                      scale,
                    }}>
                    <motion.div
                      className="relative rounded-3xl p-8 sm:p-12 border-2 overflow-hidden"
                      style={{
                        backgroundColor: "#050A14", // Tło strony jako podstawa - całkowicie nieprzezroczyste
                        borderColor: `${step.color}40`,
                        boxShadow: `0 8px 32px ${step.color}20`,
                        opacity: 1,
                      }}>
                      {/* Warstwa z blur - tylko efekt wizualny, nie wpływa na nieprzezroczystość */}
                      <div className="absolute inset-0 rounded-3xl backdrop-blur-2xl pointer-events-none" />
                      {/* Warstwa z kolorem kroku z opacity */}
                      <div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}15, rgba(0, 0, 0, 0.4))`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                      <motion.div
                        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                        style={{ background: step.color }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.2, 0.3, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      <motion.div
                        className="relative z-10"
                        style={{
                          opacity,
                        }}>
                        <h3
                          className="text-3xl sm:text-4xl font-bold mb-4"
                          style={{ color: step.color }}>
                          {step.title}
                        </h3>
                        <p className="text-xl text-gray-300 mb-8">
                          {step.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {step.details.map((detail, detailIndex) => (
                            <div
                              key={detailIndex}
                              className="flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                              <div
                                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                style={{
                                  background: step.color,
                                  boxShadow: `0 0 10px ${step.color}`,
                                }}
                              />
                              <p className="text-gray-300 leading-relaxed">
                                {detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
