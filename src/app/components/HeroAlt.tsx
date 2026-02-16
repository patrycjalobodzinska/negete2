"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroAlt() {
  const maskLeftRef = useRef<SVGPathElement>(null);
  const maskRightRef = useRef<SVGPathElement>(null);
  const neonGlowRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ukryj wszystkie elementy na początku - natychmiast, przed jakimikolwiek animacjami
      if (svgRef.current) {
        gsap.set(svgRef.current, {
          opacity: 0,
          visibility: "hidden",
          immediateRender: true,
        });
      }

      // Ukryj wszystkie litery natychmiast
      const allLetters = letterRefs.current.filter(Boolean);
      allLetters.forEach((letter) => {
        if (letter) {
          gsap.set(letter, {
            opacity: 0,
            visibility: "hidden",
            immediateRender: true,
          });
        }
      });

      if (h2Ref.current) {
        gsap.set(h2Ref.current, {
          opacity: 0,
          y: 50,
          visibility: "hidden",
          immediateRender: true,
        });
      }
      if (ctaButtonRef.current) {
        gsap.set(ctaButtonRef.current, {
          opacity: 0,
          y: 50,
          visibility: "hidden",
          immediateRender: true,
        });
      }

      const animateHalf = (maskRef: React.RefObject<SVGPathElement | null>) => {
        if (maskRef.current) {
          const length = maskRef.current.getTotalLength();
          gsap.set(maskRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
            force3D: true,
          });
          return gsap.to(maskRef.current, {
            strokeDashoffset: 0,
            duration: 2.0, // Krótsza animacja
            delay: 0.5,
            ease: "power1.out", // Prostsze easing
            force3D: true,
          });
        }
        return null;
      };

      // Na mobile: pogrubienie linii SVG (większy strokeWidth w maskach)
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (maskLeftRef.current) maskLeftRef.current.setAttribute("stroke-width", isMobile ? "140" : "100");
      if (maskRightRef.current) maskRightRef.current.setAttribute("stroke-width", isMobile ? "140" : "100");

      // Pokaż SVG tuż przed rozpoczęciem animacji (maski potrzebują widocznego SVG)
      setTimeout(() => {
        if (svgRef.current) {
          gsap.set(svgRef.current, {
            opacity: 1,
            visibility: "visible",
          });
        }
      }, 0);

      const leftAnimation = animateHalf(maskLeftRef);
      const rightAnimation = animateHalf(maskRightRef);

      // Animacja oddalenia - zaczyna się pod koniec rysowania
      if (svgRef.current && (leftAnimation || rightAnimation)) {
        const totalDuration = 0.5 + 2.0; // delay + duration
        const startDelay = 0.5 + 2.0 * 0.6; // zaczyna się gdy zostało ~40% rysowania
        // Ustaw początkową większą skalę, żeby obiekt wychodził poza granice
        gsap.set(svgRef.current, {
          scale: 1.3,
          force3D: true,
          transformOrigin: "center center",
        });
        gsap.to(svgRef.current, {
          scale: 0.85,
          duration: 1.5, // Krótsza animacja
          delay: startDelay,
          ease: "power1.out", // Prostsze easing
          force3D: true,
        });
      }

      if (neonGlowRef.current) {
        // Zoptymalizowana animacja glow - mniej częsta aktualizacja
        gsap.set(neonGlowRef.current, {
          willChange: "opacity",
        });
        gsap.to(neonGlowRef.current, {
          opacity: 0.5,
          duration: 3, // Dłuższa animacja = mniej aktualizacji
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut", // Płynniejsze easing
        });
      }

      // Animacja napisu NEGETE - każda litera osobno
      // Kolejność: N(0), E(1), G(2), E(3), T(4), E(5)
      const letters = letterRefs.current.filter(Boolean);
      if (letters.length > 0) {
        // Różne pozycje startowe dla każdej litery
        const startPositions = [
          { x: -600, y: -100 }, // N - zza ekranu od lewej i z góry
          { x: -400, y: 100 }, // E - z lewej i z dołu
          { x: 0, y: -150 }, // G - z góry
          { x: 400, y: 100 }, // E - z prawej i z dołu
          { x: 600, y: -100 }, // T - zza ekranu od prawej i z góry
          { x: 500, y: 150 }, // E - z prawej i z dołu (ostatnia)
        ];

        // Ustawiamy początkowy stan wszystkich liter
        letters.forEach((letter, index) => {
          if (letter) {
            const startPos = startPositions[index];
            // Całkowicie wyłącz blur dla wszystkich liter dla lepszej wydajności
            // Użyj CSS zamiast GSAP dla lepszej wydajności
            letter.style.willChange = "transform, opacity";
            letter.style.transform = `translate3d(${startPos.x}px, ${startPos.y}px, 0) scale(0.5)`;
            letter.style.opacity = "0";
            letter.style.filter = "none"; // Wyłącz blur dla wszystkich
            letter.style.backfaceVisibility = "hidden";
            letter.style.transformStyle = "preserve-3d";
            letter.style.perspective = "1000px";
            gsap.set(letter, {
              opacity: 0,
              visibility: "hidden",
              x: startPos.x,
              y: startPos.y,
              scale: 0.5,
              force3D: true,
              transformPerspective: 1000,
              backfaceVisibility: "hidden",
            });
          }
        });

        // Animujemy – litery wracają do naturalnego ustawienia w linii (x:0, y:0)
        setTimeout(() => {
          letters.forEach((letter, index) => {
            if (letter) {
              gsap.to(letter, {
                opacity: 1,
                visibility: "visible",
                x: 0,
                y: 0,
                z: 0,
                scale: 1,
                duration: 1.0,
                delay: 1.5 + index * 0.2,
                ease: "power1.out",
                force3D: true,
                transformPerspective: 1000,
                backfaceVisibility: "hidden",
                onComplete: function () {
                  if (letter) letter.style.willChange = "auto";
                },
              });
            }
          });
        }, 100);
      }

      // Animacja nagłówków i przycisku CTA - pojawiają się od połowy animacji liter NEGETE
      // Ustaw początkowy stan natychmiast, zanim cokolwiek się wyświetli
      const textElements = [h2Ref.current, ctaButtonRef.current].filter(
        Boolean
      );
      if (textElements.length > 0 && letters.length > 0) {
        // Ustaw początkowy stan natychmiast
        gsap.set(textElements, {
          opacity: 0,
          y: 50,
          visibility: "hidden",
          force3D: true,
          immediateRender: true,
        });

        // Oblicz moment połowy animacji liter
        // Pierwsza litera: delay 1.5s, ostatnia: delay 1.5 + 5*0.2 = 2.5s, duration 1.0s
        // Połowa animacji: (1.5 + 2.5 + 1.0/2) / 2 ≈ 2.25s
        const firstLetterStart = 1.5; // delay pierwszej litery
        const lastLetterStart = 1.5 + (letters.length - 1) * 0.2; // delay ostatniej litery
        const letterDuration = 1.0; // duration animacji każdej litery
        const animationMiddle =
          (firstLetterStart + lastLetterStart + letterDuration) / 2;
        const middleTime = animationMiddle * 1000; // konwersja na ms

        // Animacja w połowie animacji liter NEGETE
        setTimeout(() => {
          if (h2Ref.current && ctaButtonRef.current) {
            // H2 pojawia się pierwszy - zoptymalizowana animacja
            gsap.to(h2Ref.current, {
              opacity: 1,
              y: 0,
              visibility: "visible",
              duration: 0.6, // Krótsza animacja
              ease: "power1.out", // Prostsze easing
              force3D: true,
            });

            // Przycisk pojawia się po H2 z delikatnym delayem
            gsap.to(ctaButtonRef.current, {
              opacity: 1,
              y: 0,
              visibility: "visible",
              duration: 0.6, // Krótsza animacja
              delay: 0.15, // Mniejsze opóźnienie
              ease: "power1.out", // Prostsze easing
              force3D: true,
            });
          }
        }, 100 + middleTime); // 100ms (setTimeout delay) + połowa animacji liter
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback - scroll do ostatniej sekcji
      const sections = document.querySelectorAll("section");
      if (sections.length > 0) {
        sections[sections.length - 1].scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <svg
        ref={svgRef}
        className="absolute inset-0  md:top-0 w-full h-full pointer-events-none opacity-0 invisible md:translate-y-0 translate-y-[-8%]"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transformOrigin: "center center",
          overflow: "visible",
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}>
        <defs>
          {/* Maski rysujące od dołu-środka na boki i w górę */}
          <mask id="maskLeft">
            <path
              ref={maskLeftRef}
              d="M 502 309 A 520 450 0 0 1 -25 -146"
              stroke="white"
              strokeWidth="100"
              fill="none"
            />
          </mask>

          <mask id="maskRight">
            <path
              ref={maskRightRef}
              d="M 502 309 A 520 450 0 0 0 1026 -134"
              stroke="white"
              strokeWidth="100"
              fill="none"
            />
          </mask>

          <filter
            id="neonGlowEffect"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%">
            <feGaussianBlur stdDeviation="30" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter
            id="mainElementBlur"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%">
            <feGaussianBlur stdDeviation="15" />
          </filter>

          <filter
            id="strongGlowEffect"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%">
            <feGaussianBlur stdDeviation="35" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter
            id="extraStrongGlowEffect"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%">
            <feGaussianBlur stdDeviation="45" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Filtr dla granatowej poświaty */}
          <filter
            id="navyGlowEffect"
            x="-150%"
            y="-150%"
            width="400%"
            height="400%">
            <feGaussianBlur stdDeviation="50" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Granatowa poświata - używa dokładnie tych samych path co główny element */}
        <g
          filter="url(#navyGlowEffect)"
          opacity="0.7"
          style={{ willChange: "auto" }}>
          {/* Lewa strona - identyczna jak główny element */}
          <path
            mask="url(#maskLeft)"
            d="M 502 309 A 520 450 0 0 1 -25 -146 L -12 -147.5 A 517.5 448.5 0 0 0 502 307.5 Z"
            fill="#1a237e"
          />
          {/* Prawa strona - identyczna jak główny element */}
          <path
            mask="url(#maskRight)"
            d="M 502 309 A 520 450 0 0 0 1026 -134 L 1013 -135.5 A 517.5 448.5 0 0 1 502 307.5 Z"
            fill="#1a237e"
          />
        </g>

        {/* Biała poświata blisko elementu */}
        <g
          filter="url(#neonGlowEffect)"
          opacity="0.6"
          style={{ willChange: "auto" }}>
          <path
            mask="url(#maskLeft)"
            d="M 502 309 A 520 450 0 0 1 -25 -146 L -12 -147.5 A 517.5 448.5 0 0 0 502 307.5 Z"
            fill="#ffffff"
          />
          <path
            mask="url(#maskRight)"
            d="M 502 309 A 520 450 0 0 0 1026 -134 L 1013 -135.5 A 517.5 448.5 0 0 1 502 307.5 Z"
            fill="#ffffff"
          />
        </g>

        {/* Główny element biały */}
        <g filter="url(#mainElementBlur)" style={{ willChange: "auto" }}>
          {/* Lewa strona dolnego półkola - cieńsza na dole, grubsza na końcach u góry */}
          <path
            mask="url(#maskLeft)"
            d="M 502 309 A 520 450 0 0 1 -25 -146 L -12 -147.5 A 517.5 448.5 0 0 0 502 307.5 Z"
            fill="#ffffff"
          />

          {/* Prawa strona dolnego półkola */}
          <path
            mask="url(#maskRight)"
            d="M 502 309 A 520 450 0 0 0 1026 -134 L 1013 -135.5 A 517.5 448.5 0 0 1 502 307.5 Z"
            fill="#ffffff"
          />
        </g>
      </svg>

      {/* H1 dla SEO - wizualnie ukryty, ale dostępny dla wyszukiwarek */}
      <h1 className="sr-only">
        NeGeTe - Twój Zewnętrzny Dział R&D | Projektowanie Elektroniki,
        Mechaniki i Oprogramowania
      </h1>

      {/* Napis NEGETE + CTA – na mobile: litery wyżej, tekst i przycisk niżej */}
      <div className="absolute top-80 justify-end sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-full  overflow-visible px-3 sm:px-4 flex flex-col items-center gap-4 sm:gap-8">
        <div className="pointer-events-none w-full flex justify-center">
        <div
          className="flex items-baseline justify-center gap-5 min-[400px]:gap-6 sm:gap-12 md:gap-16 lg:gap-26 xl:gap-32 overflow-visible"
          style={{
            fontFamily: "var(--font-orbitron), sans-serif",
          }}>
          {"NEGETE".split("").map((letter, index) => (
            <span
              key={index}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              className="text-6xl min-[400px]:text-7xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[120px] font-medium sm:font-light text-white relative whitespace-nowrap opacity-0 invisible"
              style={{
                willChange: "transform, opacity, filter",
                transform: "translate3d(0, 0, 0)",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
                textShadow:
                  "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)",
                display: "inline-block",
                transformOrigin: "center center",
                perspective: "1000px",
                WebkitBackfaceVisibility: "hidden",
              }}>
              {letter}
            </span>
          ))}
        </div>
        </div>
        {/* Na mobile większy odstęp – tekst i przycisk niżej */}
        <div className="flex md:hidden flex-col items-center gap-4 mt-26 sm:mt-12">
        <h2
          ref={h2Ref}
          className="text-center text-base sm:text-lg md:text-xl text-gray-300 max-w-md mx-auto px-4 opacity-0 invisible">
          Twój zewnętrzny dział R&D – od pomysłu do produktu
        </h2>
        <button
          ref={ctaButtonRef}
          onClick={scrollToContact}
          className="px-6 py-3 rounded-full border border-cyan-400/50 bg-cyan-500/10 text-cyan-400 font-medium hover:bg-cyan-500/20 hover:border-cyan-400/70 transition-colors pointer-events-auto opacity-0 invisible">
          Skontaktuj się
        </button>
        </div>
      </div>
    </section>
  );
}
