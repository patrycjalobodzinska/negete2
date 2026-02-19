"use client";

interface ProcessHeroProps {
  heading: string;
  intro: string;
  heroTitleRef: React.RefObject<HTMLHeadingElement | null>;
  heroIntroRef: React.RefObject<HTMLParagraphElement | null>;
  heroLineRef: React.RefObject<HTMLDivElement | null>;
}

export function ProcessHero({
  heading,
  intro,
  heroTitleRef,
  heroIntroRef,
  heroLineRef,
}: ProcessHeroProps) {
  return (
    <div className="relative flex flex-col min-h-screen justify-center">
      <div className="text-center md:pt-36 pt-26 md:pb-16 px-4">
        <h1
          ref={heroTitleRef}
          data-hero-title
          className="text-5xl sm:text-6xl lg:text-8xl font-medium text-white md:mb-12 mb-8 leading-tight opacity-0"
        >
          {heading}
        </h1>
        <p
          ref={heroIntroRef}
          data-hero-intro
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto opacity-0"
        >
          {intro}
        </p>
        {/* Linia jest teraz czescia SVG path -- zostawiamy ref dla animacji */}
        <div
          ref={heroLineRef}
          data-hero-line
          className="md:mt-36 mt-12"
        />
      </div>
    </div>
  );
}
