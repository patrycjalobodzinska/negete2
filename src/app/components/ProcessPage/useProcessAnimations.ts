"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export function useProcessAnimations(refs: ProcessAnimationRefs, processData: unknown) {
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

  useLayoutEffect(() => {
    [pathRef.current, pathMobileRef.current].forEach((path) => {
      if (!path) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
    });
  }, [pathRef, pathMobileRef]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const title = heroTitleRef.current;
    const intro = heroIntroRef.current;
    const line = heroLineRef.current;

    if (title) tl.fromTo(title, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 });
    if (intro) tl.fromTo(intro, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");
    if (line) tl.fromTo(line, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.6 }, "-=0.35");

    return () => {
      tl.kill();
    };
  }, [heroTitleRef, heroIntroRef, heroLineRef]);

  useEffect(() => {
    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const path = pathRef.current;
    const pathMobile = pathMobileRef.current;
    const svgSection = svgSectionRef.current;
    if (!path || !svgSection) {
      return () => {
        document.documentElement.style.scrollBehavior = prevScrollBehavior;
      };
    }

    const ctx = gsap.context(() => {
      const footer = document.querySelector("footer");
      const scrollTriggerConfig = {
        trigger: svgSection,
        start: "top 35%",
        ...(footer ? { endTrigger: footer, end: "bottom bottom" } : { end: "bottom 70%" }),
        scrub: true,
      };

      [path, pathMobile].forEach((p) => {
        if (!p) return;
        const pathLength = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDashoffset: pathLength, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: scrollTriggerConfig,
          }
        );
      });

      const initHidden = () => {
        imgRefs.current.forEach((el) => el && gsap.set(el, { opacity: 0.5 }));
        cardRefs.current.forEach((el) => el && gsap.set(el, { opacity: 0.5 }));
      };
      initHidden();
      requestAnimationFrame(initHidden);

      const thresholds = [0.15, 0.35, 0.55, 0.75, 0.92];
      const animated = new Set<number>();

      ScrollTrigger.create({
        ...scrollTriggerConfig,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.05) {
            animated.clear();
            imgRefs.current.forEach((el) => el && gsap.set(el, { opacity: 0.5 }));
            cardRefs.current.forEach((el) => el && gsap.set(el, { opacity: 0.5 }));
          }
          thresholds.forEach((thr, i) => {
            if (progress >= thr && !animated.has(i)) {
              animated.add(i);
              const imgEl = imgRefs.current[i];
              const cardEl = cardRefs.current[i];
              if (imgEl) gsap.to(imgEl, { opacity: 1, duration: 0.5, ease: "power2.out" });
              if (cardEl) gsap.to(cardEl, { opacity: 1, duration: 0.5, ease: "power2.out" });
            }
          });
        },
      });

      const isMobileView = window.matchMedia("(max-width: 767px)").matches;
      const parallaxY = isMobileView ? 0 : -120;

      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.to(card, {
          y: parallaxY,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    ScrollTrigger.refresh();
    const t1 = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 400);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("load", onLoad);
      ctx.revert();
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
    };
  }, [pathRef, pathMobileRef, svgSectionRef, cardRefs, imgRefs, processData]);
}
