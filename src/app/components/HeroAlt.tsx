"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function NeonWiderSpacingSafari() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const coreLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const glowLettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const text = "NEGETE";

  // Pozycje startowe (bez zmian, bo działają dobrze)
  const startPositions = [
    { x: -550, y: 60, rotation: -30 }, // N (Jeszcze szerzej)
    { x: -350, y: -40, rotation: -20 }, // E
    { x: -180, y: 30, rotation: -10 }, // G
    { x: 180, y: -30, rotation: 10 }, // E
    { x: 350, y: 40, rotation: 20 }, // T
    { x: 550, y: -60, rotation: 30 }, // E (Jeszcze szerzej)
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- SETUP SVG ---
      const paths = svgRef.current?.querySelectorAll("path");
      if (!paths) return;
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      // --- SETUP LITER ---
      const coreLetters = coreLettersRef.current.filter(Boolean);
      const glowLetters = glowLettersRef.current.filter(Boolean);

      // 1. SETUP RDZENI (Moving Layer)
      coreLetters.forEach((letter, i) => {
        const pos = startPositions[i];
        gsap.set(letter, {
          autoAlpha: 0,
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          scale: 0.4, // Mniejszy start dla większego dramatyzmu
          transformOrigin: "center center",
        });
      });

      // 2. SETUP POŚWIAT (Static Layer)
      gsap.set(glowLetters, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        transformOrigin: "center center",
      });

      // --- TIMELINE ---
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", force3D: true },
      });

      // Animacja tła
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

        // === ANIMACJA LITER ===

        // a) Wlot RDZENI (Białe z lekkim cieniem)
        .to(
          coreLetters,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1.8, // Trochę wolniejszy lot
            stagger: {
              each: 0.12,
              from: "center",
            },
            ease: "back.out(1.5)", // Mocniejsze "odbicie" przy lądowaniu
          },
          "-=2.2",
        )

        // b) Rozpalenie POŚWIATY (Ciężki neon w miejscu)
        .to(
          glowLetters,
          {
            autoAlpha: 1,
            duration: 2.0,
            stagger: {
              each: 0.12,
              from: "center",
            },
            ease: "power2.inOut",
          },
          "<+=0.4",
        ); // Późniejszy zapłon
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- STYLE CSS ZMIANY ---

  const baseTextStyle =
    "absolute left-0 top-0 w-full h-full flex justify-center items-center font-sans font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-widest pointer-events-none select-none gap-12 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-32";

  // 1. ZMIANA SPACINGU: Usunięte mx, odstępy kontrolowane przez gap na kontenerze
  const letterStyle = "inline-block";

  // 2. ZMIANA GŁÓWNEGO NEONU: Poszerzony ostatni cień (z 70px na 100px), żeby wypełnił luki
  const neonFilterStyle = {
    filter: `
      drop-shadow(0 0 2px #fff)
      drop-shadow(0 0 10px #3949ab)
      drop-shadow(0 0 35px #1a237e)
      drop-shadow(0 0 100px rgba(26, 35, 126, 0.7))
    `,
    WebkitFilter: `
      drop-shadow(0 0 2px #fff)
      drop-shadow(0 0 10px #3949ab)
      drop-shadow(0 0 35px #1a237e)
      drop-shadow(0 0 100px rgba(26, 35, 126, 0.7))
    `,
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-[#020202] overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="absolute inset-0 w-full h-full max-w-[1500px] pointer-events-none opacity-0 m-auto"
        preserveAspectRatio="xMidYMid slice"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          ...neonFilterStyle,
        }}>
        <g fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
          <path d="M 502 309 A 520 450 0 0 1 -25 -146" />
          <path d="M 502 309 A 520 450 0 0 0 1026 -134" />
        </g>
      </svg>

      <div className="relative z-10 w-full h-[200px]">
        {/* WARSTWA 1: POŚWIATA (Static Glow) */}
        <div
          className={`${baseTextStyle} text-transparent`}
          style={neonFilterStyle}>
          {text.split("").map((letter, i) => (
            <span
              key={`glow-${i}`}
              ref={(el) => {
                glowLettersRef.current[i] = el;
              }}
              className={`${letterStyle} will-change-[opacity]`}
              style={{
                filter: `
                  drop-shadow(0 0 2px #fff)
                  drop-shadow(0 0 10px #3949ab)
                  drop-shadow(0 0 35px #1a237e)
                  drop-shadow(0 0 100px rgba(26, 35, 126, 0.7))
                  drop-shadow(0 4px 15px rgba(0, 0, 0, 0.5))
                `,
              }}>
              {letter}
            </span>
          ))}
        </div>

        {/* WARSTWA 2: RDZEŃ (Moving Core) */}
        <div className={`${baseTextStyle} mt-12 text-white`}>
          {text.split("").map((letter, i) => (
            <span
              key={`core-${i}`}
              ref={(el) => {
                coreLettersRef.current[i] = el;
              }}
              // 3. ZMIANA CIENIA RDZENIA:
              // Wyraźniejszy cień dla głębi
              className={`${letterStyle} will-change-transform`}
              style={
                {
                  textShadow:
                    "3px 3px 6px rgba(0, 0, 0, 1) !important, 6px 6px 12px rgba(0, 0, 0, 1) !important, 9px 9px 18px rgba(0, 0, 0, 0.9) !important, 12px 12px 24px rgba(0, 0, 0, 0.8) !important",
                  filter:
                    "drop-shadow(0 8px 16px rgba(0, 0, 0, 1)) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8)) !important",
                  WebkitTextStroke: "0.5px rgba(0, 0, 0, 0.3)",
                } as React.CSSProperties
              }>
              {letter}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
