# Plan refaktoryzacji i optymalizacji

## 1. DRY — eliminacja duplikacji

### 1.1 Hook `useLocalizedPath` (priorytet: wysoki)
**Problem:** `getLangFromPath()` i `getPath()` zduplikowane w 4 komponentach:
- `Navbar.tsx`, `Footer.tsx`, `TrustedBy.tsx`, `Portfolio.tsx`

**Rozwiązanie:**
```
src/hooks/useLocalizedPath.ts
├── useLocalizedPath()
│   └── zwraca { lang, getPath }
```

### 1.2 Wspólna funkcja `urlFor` (priorytet: wysoki)
**Problem:** `imageUrlBuilder` + `urlFor` zduplikowane w 5 plikach Sanity:
- `process.ts`, `blog.ts`, `portfolio.ts`, `contact.ts`, `trustedBy.ts`

**Rozwiązanie:**
```
src/sanity/image.ts
├── urlFor(source: SanityImageSource)
└── builder (imageUrlBuilder)
```

### 1.3 Helper mapowania i18n (priorytet: średni)
**Problem:** W każdym pliku Sanity powtarza się logika `lang === "pl" ? "xxxPl" : "xxxEn"`.

**Rozwiązanie:**
```
src/sanity/i18n.ts
├── langKey(lang, fieldBase) → "headingPl" | "headingEn"
└── pickByLang<T>(data, lang, plKey, enKey) → data[plKey] || data[enKey]
```

---

## 2. Rozbicie dużych komponentów

### 2.1 ProcessPage (~640 linii) — priorytet: wysoki
**Proponowana struktura:**
```
src/app/components/ProcessPage/
├── index.tsx                    # główny komponent, orchestracja
├── ProcessHero.tsx             # hero + linia
├── ProcessSvgPath.tsx          # SVG paths (desktop + mobile)
├── ProcessStepCard.tsx         # pojedyncza karta (obraz + treść)
├── ProcessCta.tsx              # sekcja CTA "Gotowy na start?"
├── constants.ts                # PATH_D, PATH_D_MOBILE, ICONS, FALLBACK_STEPS
└── useProcessAnimations.ts     # GSAP + ScrollTrigger (path, cards, images)
```

**Korzyści:**
- lepsza czytelność
- możliwość testowania mniejszych jednostek
- ponowne użycie kart

### 2.2 HeroAlt (~457 linii) — priorytet: średni
Rozbić na: `HeroAltContent`, `HeroAltBackground`, `HeroAltScroll`.

### 2.3 Contact (~326 linii) — priorytet: niski
Rozbić na: `ContactForm`, `ContactInfo`, `ContactHeading`.

---

## 3. Optymalizacje wydajnościowe

### 3.1 Lazy load ciężkich komponentów (priorytet: wysoki)
```tsx
// HeroAlt, Process, MorphParticles, RocketModel
const HeroAlt = dynamic(() => import("./HeroAlt"), { ssr: true });
const Process = dynamic(() => import("./Process"), { ssr: false });
```
- `Process` i `HeroAlt` — `ssr: false` jeśli nie są above-the-fold
- `MorphParticles`, `RocketModel` — `ssr: false` + `loading` fallback

### 3.2 Rejestracja GSAP (priorytet: średni)
**Problem:** `gsap.registerPlugin(ScrollTrigger)` w każdym komponencie.

**Rozwiązanie:** Jeden plik inicjalizujący, np. `src/lib/gsap.ts`, importowany w `layout.tsx` lub `AppShell.tsx`.

### 3.3 Memoizacja w ProcessPage (priorytet: średni)
- `sectionsToRender`, `cta` — `useMemo` przy zależnościach `processData`, `lang`
- `ProcessStepCard` — `React.memo`, żeby uniknąć zbędnych re-renderów przy scrollu

### 3.4 Optymalizacja obrazów (priorytet: średni)
- Użycie `sizes` w `<Image>` dla lepszego lazy-load
- `placeholder="blur"` gdzie sensowne

---

## 4. Architektura Sanity

### 4.1 Wspólny warstwa fetch (priorytet: średni)
**Problem:** Powtarzający się schemat: query → fetch → mapowanie po `lang`.

**Propozycja:**
```
src/sanity/
├── client.ts
├── image.ts         # wspólny urlFor
├── i18n.ts          # langKey, pickByLang
├── fetch.ts         # wrapper z error handling
└── sections/        # lub pozostawić płaską strukturę
    ├── process.ts
    ├── blog.ts
    └── ...
```

### 4.2 Cache — factory (priorytet: niski)
Zamiast powtarzać `unstable_cache(..., [key, lang], { revalidate })`:
```ts
function createCachedFetch<T>(key: string, fetcher: (lang: Language) => Promise<T>) {
  return (lang: Language) => unstable_cache(() => fetcher(lang), [key, lang], { revalidate: 3600 })();
}
```

---

## 5. Uspójnienie kodu

### 5.1 Spójne fallbacki (priorytet: niski)
- W ProcessPage: `processData?.heading || "Nasz proces"` — wyciągnąć do stałych/konfiguracji
- Ujednolicić nazewnictwo: `fallback` vs `default`

### 5.2 Czyszczenie UI (priorytet: niski)
- Nadmiarowe puste linie / komentarze
- Tailwind: `z-[15]` → `z-15` (gdzie wspierane)
- `pt-26` — upewnić się, że to prawidłowa klasa Tailwind

### 5.3 Spójne breakpointy
- `767px` vs Tailwind `md` (768px) — rozważyć jednolitą wartość
- Custom hook `useMediaQuery('(max-width: 767px)')` zamiast `useState` + `matchMedia` w kilku miejscach

---

## 6. Hooki do wydzielenia

| Hook | Źródło | Opis |
|------|--------|------|
| `useLocalizedPath` | Navbar, Footer, TrustedBy, Portfolio | lang + getPath |
| `useMediaQuery(query)` | ProcessPage, ew. inne | responsive bez hydracji |
| `useScrollRestoration` | SmoothScroll | scrollRestoration + scrollTo |
| `useGsapContext` | wielokrotnie | cleanup GSAP context |

---

## 7. Sugerowana kolejność realizacji

1. **Faza 1 — szybkie wygrane**
   - `src/sanity/image.ts` — wspólny `urlFor`
   - `src/hooks/useLocalizedPath.ts` — hook dla path
   - Rejestracja GSAP w jednym miejscu

2. **Faza 2 — ProcessPage**
   - Wydzielenie `constants.ts`, `ProcessCta.tsx`
   - `useProcessAnimations.ts`
   - Rozbicie kart i hero

3. **Faza 3 — Sanity**
   - `sanity/i18n.ts` — helper mapowania
   - Refactor funkcji fetch (stopniowo)

4. **Faza 4 — optymalizacje**
   - Lazy load komponentów
   - Memoizacja
   - Cache factory

5. **Faza 5 — porządki**
   - HeroAlt, Contact
   - Uspójnienie fallbacków i breakpointów

---

## 8. Metryki przed/po (opcjonalne)

- Liczba zduplikowanych linii
- Bundle size (`next build` → .next/analyze)
- Lighthouse (LCP, CLS, TBT)
- Liczba plików > 300 linii
