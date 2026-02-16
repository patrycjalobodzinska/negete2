"use client";

import { useRef, useEffect, useState } from "react";
import { Cpu, Code, Box, Zap, Award, Factory } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RocketSVG from "./RocketSVG";
import {
  fetchServicesSection,
  type ServicesSection,
  type ServiceItem,
} from "@/sanity/services";
import type { Language } from "@/i18n/config";

const ICONS = {
  Cpu,
  Code,
  Box,
  Zap,
  Award,
  Factory,
} as const;

const FALLBACK_SERVICES: ServiceItem[] = [
  {
    iconKey: "Cpu",
    title: "Projektowanie Elektroniki & PCB",
    description:
      "Schematy ideowe, obwody wielowarstwowe, symulacje oraz projektowanie pod kątem kompatybilności elektromagnetycznej (EMC/EMI).",
  },
  {
    iconKey: "Code",
    title: "Firmware & Embedded",
    description:
      "Oprogramowanie wbudowane (C/C++), sterowniki mikrokontrolerów, systemy IoT oraz bezpieczna komunikacja bezprzewodowa.",
  },
  {
    iconKey: "Box",
    title: "Mechanika & Wzornictwo",
    description:
      "Projekty obudów w CAD 3D, dobór materiałów, projektowanie form wtryskowych oraz pełna dokumentacja techniczna 2D/3D.",
  },
  {
    iconKey: "Zap",
    title: "Szybkie Prototypowanie",
    description:
      "Weryfikacja koncepcji poprzez druk 3D, frezowanie CNC oraz montaż próbny układów elektronicznych (PCBA).",
  },
  {
    iconKey: "Award",
    title: "Certyfikacja i Testy",
    description:
      "Przygotowanie produktu do oznaczenia znakiem CE, badania wstępne oraz tworzenie dokumentacji wymaganej prawem.",
  },
  {
    iconKey: "Factory",
    title: "Produkcja Seryjna",
    description:
      "Organizacja łańcucha dostaw, nadzór nad produkcją elektroniki, kontrola jakości i skalowanie produkcji.",
  },
];

interface ServicesProps {
  lang?: Language;
  initialData?: ServicesSection | null;
}

export default function Services({
  lang = "pl",
  initialData,
}: ServicesProps) {
  const [servicesData, setServicesData] = useState<ServicesSection | null>(
    initialData ?? null
  );

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const featuresRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (initialData) return;
    fetchServicesSection(lang)
      .then((data) => data && setServicesData(data))
      .catch((err) =>
        console.error("Błąd pobierania sekcji usług z Sanity:", err)
      );
  }, [lang, initialData]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animacja tytułu
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Animacja lewego tekstu
      if (leftTextRef.current) {
        gsap.fromTo(
          leftTextRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Animacja prawego tekstu i przycisku
      if (rightTextRef.current) {
        gsap.fromTo(
          rightTextRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.3,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.5,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Animacja feature blocks
      featuresRef.current.forEach((feature, index) => {
        if (feature) {
          gsap.fromTo(
            feature,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.4 + index * 0.1,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services =
    servicesData?.services && servicesData.services.length > 0
      ? servicesData.services
      : FALLBACK_SERVICES;

  return (
    <section
      ref={sectionRef}
      data-section="services"
      className="relative min-h-screen max-w-7xl mx-auto md:py-32 pb-12 px-6 ">
      <div className="">
        <div className="flex flex-col max-w-6xl gap-4 items-start">
          {/* Lewa strona - tytuł i tekst */}
          <div className=" relative z-10">
            <div ref={leftTextRef} className="space-y-6">
              <h2
                ref={titleRef}
                className="text-3xl sm:text-4xl font-medium text-white leading-tight">
                {servicesData?.heading ??
                  "Twój Zewnętrzny Dział R&D – od pomysłu do wdrożenia"}
              </h2>
              <div className="space-y-4 border-l-4 border-primary pl-4 text-gray-300 text-base md:text-lg leading-relaxed">
                <p>
                  {servicesData?.intro ??
                    "Przejmujemy pełną odpowiedzialność za technologiczną stronę Twojego produktu. Łączymy projektowanie elektroniki, inżynierię mechaniczną i oprogramowanie w jeden spójny proces. Dzięki temu skracamy czas wdrożenia (Time-to-Market) i eliminujemy błędy montażowe już na etapie koncepcji."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Rakieta SVG na środku - tylko na desktop, przyklejona do sekcji */}
      <div className="hidden    lg:block absolute  inset-x-0 pointer-events-none z-0">
        <RocketSVG sectionId="services" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Layout - tekst po lewej i prawej, rakieta na środku */}

        {/* Elementy usług po bokach rakiety - 3 po lewej, 3 po prawej */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {/* Lewa strona - 3 elementy */}
          <div className="space-y-8">
            {services.slice(0, 3).map((service, index) => {
              const Icon =
                ICONS[
                  (service.iconKey as keyof typeof ICONS) ??
                    ("Cpu" as keyof typeof ICONS)
                ] ?? Cpu;
              return (
                <div
                  key={service.title}
                  ref={(el) => {
                    if (el) featuresRef.current[index] = el;
                  }}
                  className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Środek - rakieta (zajmuje środkową kolumnę) */}
          <div className="hidden lg:block relative h-full">
            {/* Rakieta renderowana w RocketSVG - pozycjonowana absolutnie */}
          </div>

          {/* Prawa strona - 3 elementy */}
          <div className="space-y-8">
            {services.slice(3, 6).map((service, index) => {
              const Icon =
                ICONS[
                  (service.iconKey as keyof typeof ICONS) ??
                    ("Cpu" as keyof typeof ICONS)
                ] ?? Cpu;
              return (
                <div
                  key={service.title}
                  ref={(el) => {
                    if (el) featuresRef.current[index + 3] = el;
                  }}
                  className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
