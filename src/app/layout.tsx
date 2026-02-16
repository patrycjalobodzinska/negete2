import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { defaultLanguage, type Language } from "@/i18n/config";
import Aurora from "./components/Aurora";
import AppShell from "./components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeGeTe | Twój zewnętrzny dział R&D",
  description:
    "NeGeTe - projektowanie elektroniki, mechaniki i oprogramowania. Od pomysłu do produktu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang: Language = defaultLanguage;

  return (
    <html lang={lang}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration'in history){history.scrollRestoration='manual'}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: -1 }}>
          <Aurora
            colorStops={["#182e60", "#405f92"]}
            blend={0.5}
            amplitude={0.5}
            speed={0.7}
          />
        </div>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
