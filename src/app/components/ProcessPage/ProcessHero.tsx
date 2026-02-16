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
    <div className="relative flex flex-col justify-center">
      <div className="text-center md:pt-36 pt-26 md:pb-16 px-4">
        <h1
          ref={heroTitleRef}
          className="text-5xl sm:text-6xl lg:text-8xl font-medium text-white md:mb-12 mb-8 leading-tight opacity-0"
        >
          {heading}
        </h1>
        <p
          ref={heroIntroRef}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto opacity-0"
        >
          {intro}
        </p>
        <div
          ref={heroLineRef}
          className="h-1 w-48 sm:w-96 mx-auto md:mt-26 mt-12 rounded-full origin-center opacity-0"
          style={{
            background: "linear-gradient(90deg, transparent, #1e3a8a, transparent)",
            boxShadow:
              "0 8px 50px 12px rgba(30,58,138,0.6), 0 20px 80px 24px rgba(30,58,138,0.4)",
          }}
        />
      </div>
    </div>
  );
}
