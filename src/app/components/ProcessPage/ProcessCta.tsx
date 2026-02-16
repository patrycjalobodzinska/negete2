"use client";

import Link from "next/link";
import type { ProcessPageCta } from "@/sanity/process";

interface ProcessCtaProps {
  cta: ProcessPageCta;
  variant?: "standalone" | "inline-desktop" | "inline-mobile";
  cardRef?: (el: HTMLDivElement | null) => void;
  className?: string;
}

export function ProcessCta({ cta, variant = "standalone", cardRef, className = "" }: ProcessCtaProps) {
  const isMobile = variant === "inline-mobile";
  const isDesktop = variant === "inline-desktop";

  const content = (
    <>
      <h2
        className={
          isMobile
            ? "text-xl font-bold text-white mb-3"
            : "text-2xl font-bold text-white mb-4"
        }
      >
        {cta.title}
      </h2>
      <p
        className={
          isMobile
            ? "text-gray-400 leading-relaxed mb-6"
            : "text-gray-400 text-lg leading-relaxed mb-8"
        }
      >
        {cta.description}
      </p>
      <Link
        href={cta.link}
        className={
          isMobile
            ? "inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            : "inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
        }
      >
        {cta.buttonText}
      </Link>
    </>
  );

  if (isDesktop) {
    return (
      <div
        ref={cardRef}
        className="absolute z-20 left-1/2 -translate-x-1/2 w-[min(580px,90%)]"
        style={{ top: "88%" }}
      >
        <div className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-10 text-center border border-white/10 shadow-xl">
          {content}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div
        ref={cardRef}
        className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 shadow-xl mt-12 ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <section className="flex justify-center items-center min-h-[60vh] py-24 px-6 max-md:block max-md:py-16">
      <div className="w-full max-w-[700px] bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-10 text-center border border-white/10 shadow-xl">
        {content}
      </div>
    </section>
  );
}
