"use client";

import { useEffect, useLayoutEffect } from "react";

interface ProcessAnimationRefs {
  pathRef: React.RefObject<SVGPathElement | null>;
  pathMobileRef: React.RefObject<SVGPathElement | null>;
  svgSectionRef: React.RefObject<HTMLElement | null>;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  imgRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  heroTitleRef: React.RefObject<HTMLHeadingElement | null>;
  heroIntroRef: React.RefObject<HTMLParagraphElement | null>;
  heroLineRef: React.RefObject<HTMLDivElement | null>;
}

/** Proste animacje bez GSAP/ScrollTrigger – tylko CSS + Intersection Observer. */
export function useProcessAnimations(
  refs: ProcessAnimationRefs,
  processData: unknown,
  isMobile: boolean
) {
  const {
    cardRefs,
    imgRefs,
    heroTitleRef,
    heroIntroRef,
    heroLineRef,
  } = refs;

  // Hero: po wejściu pokaż elementy (prosty fade, bez GSAP)
  useLayoutEffect(() => {
    const title = heroTitleRef.current;
    const intro = heroIntroRef.current;
    const line = heroLineRef.current;

    if (title) {
      title.classList.remove("opacity-0");
      title.style.transition = "opacity 0.4s ease-out";
    }
    if (intro) {
      intro.classList.remove("opacity-0");
      intro.style.transition = "opacity 0.4s ease-out 0.1s";
    }
    if (line) {
      line.classList.remove("opacity-0");
      line.style.transition = "opacity 0.4s ease-out 0.2s";
    }

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (title) title.style.opacity = "1";
        if (intro) intro.style.opacity = "1";
        if (line) line.style.opacity = "1";
      });
    });

    return () => cancelAnimationFrame(rafId);
  }, [heroTitleRef, heroIntroRef, heroLineRef]);

  // Karty: wyłączone animacje – pokazuj od razu (najprostsze rozwiązanie)
  useEffect(() => {
    // Po załadowaniu danych ustaw karty i obrazy jako widoczne
    const t = setTimeout(() => {
      cardRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = "1";
        }
      });
      imgRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = "1";
        }
      });
    }, 100);

    return () => clearTimeout(t);
  }, [cardRefs, imgRefs, processData, isMobile]);
}
