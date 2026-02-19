"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

/** Animacje z GSAP i ScrollTrigger - przywrócone */
export function useProcessAnimations(
  refs: ProcessAnimationRefs,
  processData: unknown,
  isMobile: boolean
) {
  const {
    pathRef,
    pathMobileRef,
    svgSectionRef,
    cardRefs,
    imgRefs,
    heroTitleRef,
    heroIntroRef,
    heroLineRef,
  } = refs;

  // Hero: animacja fade-in
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
            force3D: true,
          }
        );
      }
      if (heroIntroRef.current) {
        gsap.fromTo(
          heroIntroRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.4,
            ease: "power2.out",
            force3D: true,
          }
        );
      }
      if (heroLineRef.current) {
        gsap.fromTo(
          heroLineRef.current,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            delay: 0.6,
            ease: "power2.out",
            force3D: true,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [heroTitleRef, heroIntroRef, heroLineRef]);

  // SVG Path: animacja rysowania podczas scrollowania
  useEffect(() => {
    if (!svgSectionRef.current) return;

    const ctx = gsap.context(() => {
      const path = isMobile ? pathMobileRef.current : pathRef.current;
      if (!path) return;

      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      ScrollTrigger.create({
        trigger: svgSectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 3,
        onUpdate: (self) => {
          const progress = self.progress;
          // Wolniejsze, rownomierne rysowanie
          const easedProgress = gsap.utils.clamp(0, 1, progress);
          gsap.set(path, {
            strokeDashoffset: pathLength * (1 - easedProgress),
            force3D: true,
          });
        },
      });
    }, svgSectionRef.current);

    return () => ctx.revert();
  }, [pathRef, pathMobileRef, svgSectionRef, isMobile]);

  // Karty i obrazy: animacja podczas scrollowania
  useEffect(() => {
    if (!svgSectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      const images = imgRefs.current.filter(Boolean);

      cards.forEach((card, index) => {
        if (!card) return;
        gsap.set(card, {
          opacity: 0.5,
          y: 50,
          force3D: true,
        });

        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              force3D: true,
            });
          },
        });
      });

      images.forEach((img, index) => {
        if (!img) return;
        gsap.set(img, {
          opacity: 0.5,
          scale: 0.95,
          force3D: true,
        });

        ScrollTrigger.create({
          trigger: img,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
          onEnter: () => {
            gsap.to(img, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              force3D: true,
            });
          },
        });
      });
    }, svgSectionRef.current);

    return () => ctx.revert();
  }, [cardRefs, imgRefs, svgSectionRef, processData, isMobile]);
}
