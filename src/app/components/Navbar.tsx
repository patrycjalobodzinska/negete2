"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { t } from "@/i18n/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { lang, getPath } = useLocalizedPath();

  const [blogCount, setBlogCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/blog/count")
      .then((res) => res.json())
      .then((data: { count: number }) => setBlogCount(data.count))
      .catch(() => setBlogCount(0));
  }, []);

  const baseNavLinks = [
    { name: t(lang, "nav.home"), href: "/", key: "home" },
    { name: t(lang, "nav.projects"), href: "/realizacje", key: "projects" },
    { name: t(lang, "nav.process"), href: "/proces", key: "process" },
    { name: t(lang, "nav.services"), href: "/uslugi", key: "services" },
    { name: t(lang, "nav.blog"), href: "/blog", key: "blog" },
    { name: t(lang, "nav.faq"), href: "/faq", key: "faq" },
    { name: t(lang, "nav.contact"), href: "/kontakt", key: "contact" },
  ];

  const navLinks = baseNavLinks.filter(
    (link) => link.key !== "blog" || (blogCount !== null && blogCount > 0)
  );

  const isActive = (href: string, key: string) => {
    if (key === "home") {
      // Strona główna jest aktywna gdy pathname to "/" (PL) lub "/en" (EN)
      return pathname === "/" || pathname === `/${lang}`;
    }
    const fullPath = getPath(href);
    return pathname === fullPath || pathname.startsWith(fullPath + "/");
  };

  // Animacja wejścia navbara z góry
  useEffect(() => {
    if (navRef.current) {
      gsap.set(navRef.current, { y: -100, opacity: 0 });
      setTimeout(() => {
        if (navRef.current) {
          gsap.to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          });
        }
      }, 800);
    }
  }, []);

  // Początkowy stan menu (ukryte)
  useLayoutEffect(() => {
    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { opacity: 0, y: -12 });
    }
  }, []);

  // Płynna animacja menu mobilnego (otwarcie/zamknięcie)
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (isMobileMenuOpen) {
      gsap.to(menu, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: -12,
        duration: 0.25,
        ease: "power2.in",
        overwrite: true,
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-4 max-w-7xl mx-auto left-4 right-4 z-[99999999999] rounded-full md:rounded-full"
        style={{
          background:
            "linear-gradient(to right, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.1))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-0.5 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={getPath("/")} className="flex items-center">
                <img src="/negete_logo.png" alt="NEGETE Logo" className="h-12" />
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.href, link.key);
                return (
                  <Link
                    key={link.name}
                    href={getPath(link.href)}
                    className={`transition-colors text-sm font-medium tracking-wide ${
                      active
                        ? "text-[#00f0ff]"
                        : "text-gray-300 hover:text-[#00f0ff]"
                    }`}>
                    {link.name}
                  </Link>
                );
              })}
              <LanguageSwitcher variant="navbar" />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobilne — poza nav, absolute pod paskiem, nie rozciąga navbara */}
      <div
        className="fixed top-[calc(1rem+3.5rem)] left-4 right-4 z-[99999999998] md:hidden"
        style={{ pointerEvents: isMobileMenuOpen ? "auto" : "none" }}>
        <div
          ref={mobileMenuRef}
          aria-hidden={!isMobileMenuOpen}
          className="rounded-2xl overflow-hidden opacity-0 -translate-y-3"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}>
          <nav className="px-4 pt-3 pb-5 space-y-1" aria-label="Menu główne">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.key);
              return (
                <Link
                  key={link.name}
                  href={getPath(link.href)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-3 rounded-xl text-sm font-medium tracking-wide transition-colors ${
                    active
                      ? "text-[#00f0ff] bg-cyan-500/10"
                      : "text-gray-300 hover:text-[#00f0ff] hover:bg-white/5"
                  }`}>
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-white/10">
              <LanguageSwitcher variant="footer" />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
