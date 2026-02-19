"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import type { Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";

interface HeroAltProps {
  lang?: Language;
}

export default function NeonSideFlyInSafari({ lang = "pl" }: HeroAltProps) {
  const subtitleRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // DWA zestawy refów dla tej samej treści (Technika Split-Layer)
  const coreLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const glowLettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const text = "NEGETE";

  // === KONFIGURACJA WLOTU ===
  // Definiujemy, skąd mają przylecieć litery.
  // Ujemne X = z lewej, Dodatnie X = z prawej.
  const startPositions = [
    { x: -450, y: 50, rotation: -25 }, // N (Lewa, mocno)
    { x: -300, y: -30, rotation: -15 }, // E (Lewa, średnio)
    { x: -150, y: 20, rotation: -5 }, // G (Lewa, blisko)
    { x: 150, y: -20, rotation: 5 }, // E (Prawa, blisko)
    { x: 300, y: 30, rotation: 15 }, // T (Prawa, średnio)
    { x: 450, y: -50, rotation: 25 }, // E (Prawa, mocno)
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- SETUP SVG TŁA ---
      const paths = svgRef.current?.querySelectorAll("path");
      if (!paths) return;
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      // --- SETUP LITER ---
      const coreLetters = coreLettersRef.current.filter(Boolean);
      const glowLetters = glowLettersRef.current.filter(Boolean);

      // 1. Ustawiamy RDZENIE (Core - Moving Layer): Rozrzucamy je na boki
      coreLetters.forEach((letter, i) => {
        const pos = startPositions[i];
        gsap.set(letter, {
          autoAlpha: 0, // Na starcie niewidoczne
          x: pos.x, // Pozycja boczna
          y: pos.y, // Lekkie przesunięcie góra/dół
          rotation: pos.rotation, // Obrót
          scale: 0.5, // Zmniejszone na starcie
          transformOrigin: "center center",
        });
      });

      // 2. Ustawiamy POŚWIATY (Glow - Static Layer): Stoją w centrum, ukryte
      gsap.set(glowLetters, {
        autoAlpha: 0, // Niewidoczne
        x: 0, // Na środku
        y: 0,
        rotation: 0, // Wyprostowane
        scale: 1, // Normalna wielkość
        transformOrigin: "center center",
      });

      // --- GŁÓWNY TIMELINE ANIMACJI ---
      const tl = gsap.timeline({
        // force3D: true jest kluczowe dla Safari
        defaults: { ease: "power3.inOut", force3D: true },
      });

      // Animacja linii SVG (tło) - startuje pierwsza
      tl.to(svgRef.current, {
        autoAlpha: 1,
        y: -60,
        scale: 1.15,
        duration: 2.5,
      })
        .to(
          paths,
          {
            strokeDashoffset: 0,
            duration: 3,
            stagger: 0,
          },
          "-=2",
        )

        // === KLUCZOWA ANIMACJA LITER ===

        // a) Wlot RDZENI (Białe litery lecą z boków)
        .to(
          coreLetters,
          {
            autoAlpha: 1, // Pojawiają się w trakcie lotu
            x: 0, // Lecą do środka
            y: 0,
            scale: 1, // Powiększają się
            rotation: 0, // Prostują się
            duration: 1.6, // Czas przelotu
            stagger: {
              each: 0.1, // Opóźnienie między kolejnymi literami
              from: "center", // Zaczynają środkowe (G,E), potem zewnętrzne
            },
            ease: "back.out(1.4)", // Efekt sprężystego lądowania
          },
          "-=2.2",
        ) // Zaczynają lecieć, gdy linie tła jeszcze się rysują

        // b) Rozpalenie POŚWIATY (Cienie pojawiają się w miejscu)
        .to(
          glowLetters,
          {
            autoAlpha: 1, // Tylko zmiana przezroczystości
            duration: 1.8, // Trochę wolniej dla miękkości
            stagger: {
              each: 0.1,
              from: "center",
            },
            ease: "power2.inOut", // Miękkie pojawienie się światła
          },
          "<+=0.3",
        ) // "<+=0.3" Zaczynają się rozpalać 0.3s po starcie wlotu rdzeni

      // c) Pulsowanie neonu - uzywamy opacity zamiast animacji filtra (GPU-accelerated)
      const glowLayer = containerRef.current?.querySelector(".neon-glow-layer");
      if (glowLayer) {
        tl.to(
          glowLayer,
          {
            opacity: 0.6,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
          "+=0.5",
        );
      }

      // d) Subtitle + scroll indicator fade in
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { autoAlpha: 0, y: 20 });
        tl.to(
          subtitleRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=2",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- STYLE CSS ---

  // Bazowy styl kontenera na tekst
  const baseTextStyle =
    "absolute left-0 top-0 w-full h-full flex justify-center items-center font-sans font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-widest pointer-events-none select-none";

  // Styl pojedynczej litery (odstępy) – invisible by default to prevent FOUC
  const letterStyle = "inline-block mx-3 sm:mx-5 md:mx-7 invisible opacity-0";

  // Neonowy text-shadow (znacznie wydajniejszy niz drop-shadow filter)
  const neonTextShadow = `
    0 0 4px #fff,
    0 0 8px #fff,
    0 0 20px #4fc3f7,
    0 0 40px #0288d1,
    0 0 80px #01579b,
    0 0 120px rgba(1, 87, 155, 0.7)
  `;

  // Lzejszy neon dla rdzenia
  const coreTextShadow = `
    0 0 3px #fff,
    0 0 10px #4fc3f7,
    0 0 25px #0288d1,
    0 0 50px rgba(2, 136, 209, 0.4)
  `;

  // SVG nadal potrzebuje drop-shadow (bo text-shadow nie dziala na SVG)
  const svgNeonFilter = {
    filter: `
      drop-shadow(0 0 4px #fff)
      drop-shadow(0 0 15px #4fc3f7)
      drop-shadow(0 0 40px #0288d1)
    `,
  };

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-12">
      {/* SVG TLA (Linie) */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="absolute inset-0 w-full h-full max-w-[1400px] pointer-events-none invisible opacity-0 m-auto"
        preserveAspectRatio="xMidYMid slice"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          ...svgNeonFilter,
        }}>
        <g fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
          <path d="M 502 309 A 520 450 0 0 1 -25 -146" />
          <path d="M 502 309 A 520 450 0 0 0 1026 -134" />
        </g>
      </svg>

      {/* KONTENER NA TEKST (Dwie nalozone warstwy) */}
      <div className="relative z-10 w-full h-[200px]">
        {/* WARSTWA 1: POSWIATA (Glow Layer - Static) */}
        <div
          className={`${baseTextStyle} text-[#4fc3f7] neon-glow-layer`}
          style={{ textShadow: neonTextShadow }}>
          {text.split("").map((letter, i) => (
            <span
              key={`glow-${i}`}
              ref={(el) => {
                glowLettersRef.current[i] = el;
              }}
              className={`${letterStyle} will-change-[opacity]`}>
              {letter}
            </span>
          ))}
        </div>

        {/* WARSTWA 2: RDZEN (Core Layer - Moving) */}
        <div className={`${baseTextStyle} text-white`} style={{ textShadow: coreTextShadow }}>
          {text.split("").map((letter, i) => (
            <span
              key={`core-${i}`}
              ref={(el) => {
                coreLettersRef.current[i] = el;
              }}
              className={`${letterStyle} will-change-transform`}>
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* PODTYTUL + STRZALKA SCROLL (widoczne glownie na mobile) */}
      <div
        ref={subtitleRef}
        className="relative z-10 mt-10 flex flex-col items-center gap-6 invisible opacity-0">
        <p
          className="text-sm sm:text-base tracking-[0.25em] uppercase text-white/70 font-light text-center"
          style={{
            textShadow: "0 0 8px rgba(79, 195, 247, 0.3)",
          }}>
          {t(lang, "hero.subtitle")}
        </p>
        <button
          onClick={handleScrollDown}
          aria-label={t(lang, "hero.scroll")}
          className="group flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer">
          <span className="text-xs tracking-widest uppercase hidden sm:block">
            {t(lang, "hero.scroll")}
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
