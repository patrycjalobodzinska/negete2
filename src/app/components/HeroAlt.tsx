"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function NeonSideFlyInSafari() {
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
        ); // "<+=0.3" Zaczynają się rozpalać 0.3s po starcie wlotu rdzeni
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- STYLE CSS ---

  // Bazowy styl kontenera na tekst
  const baseTextStyle =
    "absolute left-0 top-0 w-full h-full flex justify-center items-center font-sans font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-widest pointer-events-none select-none";

  // Styl pojedynczej litery (odstępy) – invisible by default to prevent FOUC
  const letterStyle = "inline-block mx-3 sm:mx-5 md:mx-7 invisible opacity-0";

  // POTĘŻNY FILTR NEONOWY (Tylko dla warstwy statycznej)
  // Używamy CSS drop-shadow, bo Safari radzi sobie z nim lepiej niż z filtrami SVG
  const neonFilterStyle = {
    filter: `
      drop-shadow(0 0 2px #fff)
      drop-shadow(0 0 10px #3949ab)
      drop-shadow(0 0 30px #1a237e)
      drop-shadow(0 0 70px rgba(26, 35, 126, 0.6))
    `,
    WebkitFilter: `
      drop-shadow(0 0 2px #fff)
      drop-shadow(0 0 10px #3949ab)
      drop-shadow(0 0 30px #1a237e)
      drop-shadow(0 0 70px rgba(26, 35, 126, 0.6))
    `,
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-[#020202] overflow-hidden">
      {/* SVG TŁA (Linie) */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="absolute inset-0 w-full h-full max-w-[1400px] pointer-events-none invisible opacity-0 m-auto"
        preserveAspectRatio="xMidYMid slice"
        style={{
          willChange: "transform", // Optymalizacja dla Safari
          transform: "translateZ(0)",
          // Ten sam filtr co na literach dla spójności
          ...neonFilterStyle,
        }}>
        <g fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
          <path d="M 502 309 A 520 450 0 0 1 -25 -146" />
          <path d="M 502 309 A 520 450 0 0 0 1026 -134" />
        </g>
      </svg>

      {/* KONTENER NA TEKST (Dwie nałożone warstwy) */}
      <div className="relative z-10 w-full h-[200px]">
        {/* WARSTWA 1: POŚWIATA (Glow Layer - Static) */}
        {/* Tekst jest przezroczysty, widać tylko ciężki cień CSS. STOI W MIEJSCU. */}
        <div
          className={`${baseTextStyle} text-transparent`}
          style={neonFilterStyle}>
          {text.split("").map((letter, i) => (
            <span
              key={`glow-${i}`}
              ref={(el) => {
                glowLettersRef.current[i] = el;
              }}
              className={`${letterStyle} will-change-[opacity]`} // Tylko opacity się zmienia
            >
              {letter}
            </span>
          ))}
        </div>

        {/* WARSTWA 2: RDZEŃ (Core Layer - Moving) */}
        {/* Czysty biały tekst bez ciężkiego cienia. TO ON SIĘ RUSZA. */}
        <div className={`${baseTextStyle} text-white`}>
          {text.split("").map((letter, i) => (
            <span
              key={`core-${i}`}
              ref={(el) => {
                coreLettersRef.current[i] = el;
              }}
              // Dodajemy tylko leciutki cień dla ostrości krawędzi
              className={`${letterStyle} will-change-transform drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}>
              {letter}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
