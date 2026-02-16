"use client";

import { useRef, useEffect, useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { fetchFaqSection } from "@/sanity/faq";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { FaqSection } from "@/sanity/faq";

const FOOTER_FAQ_PREVIEW_COUNT = 3;

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { lang, getPath } = useLocalizedPath();
  const [faqData, setFaqData] = useState<FaqSection | null>(null);

  useEffect(() => {
    fetchFaqSection(lang).then((data) => setFaqData(data));
  }, [lang]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
            },
          }
        );
      }

      sectionsRef.current.forEach((section, index) => {
        if (section) {
          gsap.fromTo(
            section,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 90%",
              },
            }
          );
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const footerLinks = {
    company: [
      { name: "O nas", href: getPath("/"), key: "home" },
      { name: "Projekty", href: getPath("/realizacje"), key: "projects" },
      { name: "Proces", href: getPath("/proces"), key: "process" },
      { name: "Blog", href: getPath("/blog"), key: "blog" },
      { name: "FAQ", href: getPath("/faq"), key: "faq" },
    ],
    services: [
      { name: "Projektowanie PCB", href: getPath("/"), key: "services" },
      { name: "Firmware", href: getPath("/"), key: "services" },
      { name: "Mechanika", href: getPath("/"), key: "services" },
      { name: "Prototypowanie", href: getPath("/"), key: "services" },
    ],
    legal: [
      { name: "Polityka prywatności", href: getPath("/polityka-prywatnosci"), key: "privacy" },
      { name: "Regulamin", href: getPath("/regulamin"), key: "terms" },
      { name: "Cookies", href: getPath("/cookies"), key: "cookies" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const contactInfo = [
    { icon: Mail, text: "kontakt@negete.pl", href: "mailto:kontakt@negete.pl" },
    { icon: Phone, text: "+48 123 456 789", href: "tel:+48123456789" },
    {
      icon: MapPin,
      text: "Warszawa, Polska",
      href: "#",
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-white/10 bg-gradient-to-b from-transparent to-black/20 backdrop-blur-sm">
      {/* Krótka linia nad kontaktem — z cieniem */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-32 sm:w-48 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, #1e3a8a, transparent)",
          boxShadow:
            "0 8px 50px 12px rgba(30,58,138,0.6), 0 20px 80px 24px rgba(30,58,138,0.4)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo i opis */}
          <div
            ref={(el) => {
              sectionsRef.current[0] = el;
            }}
            className="space-y-4">
            <Link href={getPath("/")} className="inline-block">
              <img
                src="/negete_logo.png"
                alt="NEGETE Logo"
                className="h-12 mb-4"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Twój zewnętrzny dział R&D. Od pomysłu do seryjnej produkcji.
              Profesjonalne usługi w dziedzinie elektroniki, mechaniki i
              oprogramowania.
            </p>
            {/* Social media */}
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-400/20 hover:border-cyan-400/50 border border-white/10 transition-all duration-300 group">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Firma */}
          <div
            ref={(el) => {
              sectionsRef.current[1] = el;
            }}
            className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Firma</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Usługi */}
          <div
            ref={(el) => {
              sectionsRef.current[2] = el;
            }}
            className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Usługi</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div
            ref={(el) => {
              sectionsRef.current[3] = el;
            }}
            className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Kontakt</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index}>
                    <a
                      href={info.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors text-sm group">
                      <Icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                      <span>{info.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* FAQ — kilka pierwszych pytań + link do pełnej strony */}
        {faqData?.items && faqData.items.length > 0 && (
          <div
            ref={(el) => {
              sectionsRef.current[4] = el;
            }}
            className="border-t border-white/10 pt-10 mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex-1">
                <Link
                  href={getPath("/faq")}
                  className="text-white font-bold text-lg mb-4 inline-flex items-center gap-2 hover:text-cyan-400 transition-colors group"
                >
                  FAQ
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <ul className="space-y-2 mt-2">
                  {faqData.items.slice(0, FOOTER_FAQ_PREVIEW_COUNT).map((item) => (
                    <li key={item.id}>
                      <Link
                        href={getPath("/faq")}
                        className="text-gray-400 hover:text-cyan-400 transition-colors text-sm line-clamp-1"
                      >
                        {item.question}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={getPath("/faq")}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium shrink-0"
              >
                {lang === "pl" ? "Wszystkie pytania →" : "All questions →"}
              </Link>
            </div>
          </div>
        )}

        {/* Dolna sekcja - Copyright, język, linki prawne */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NEGETE. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <LanguageSwitcher variant="footer" />
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Neonowy efekt na dole */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </footer>
  );
}
