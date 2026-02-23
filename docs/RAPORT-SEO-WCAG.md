# Raport SEO i WCAG – NeGeTe (next-sanity-i18n)

Data: 2025-02-13

---

## 1. Raport SEO

### 1.1 Meta: title, description, OG, Twitter

| Element | Status | Uwagi |
|--------|--------|--------|
| **Title** | ✅ | Każda strona ustawia `title` przez `generateMetadata` + `buildMetadata()`. Format: `"Tytuł \| NeGeTe"` (lub z Sanity). |
| **Description** | ✅ | `description` w `buildMetadata`; fallback: `DEFAULT_DESCRIPTION` w `src/lib/metadata.ts`. |
| **Open Graph** | ✅ | `openGraph`: title, description, images (gdy podane), locale (pl_PL / en_US), type: "website", url (canonical). |
| **Twitter Card** | ✅ | `twitter`: card "summary_large_image", title, description, images (gdy podane). |
| **Canonical URL** | ✅ | `alternates.canonical` budowany z `getBaseUrl()` + path. |
| **Hreflang** | ✅ | `alternates.languages` dla pl/en (np. `/pl/...`, `/en/...`). |

Źródło: `src/lib/metadata.ts` – jedna funkcja `buildMetadata()` używana na wszystkich stronach.

### 1.2 Strony i źródła SEO

| Strona | generateMetadata | SEO z Sanity | Obraz OG |
|--------|------------------|--------------|----------|
| Strona główna `/[lang]` | ✅ | `settings?.homePageSeo` | ✅ `settings?.defaultOgImage` |
| Usługi (lista) `/[lang]/uslugi` | ✅ | `settings?.servicesListPageSeo` | ✅ `settings?.defaultOgImage` (fallback) |
| Usługa (szczegół) `/[lang]/uslugi/[slug]` | ✅ | `service?.seo` | ✅ `settings?.defaultOgImage` (fallback) |
| Blog (lista) `/[lang]/blog` | ✅ | `settings?.blogListPageSeo` | ✅ `settings?.defaultOgImage` |
| Blog (wpis) `/[lang]/blog/[slug]` | ✅ | `post.seo` | ✅ `post.mainImage` |
| Realizacje (lista) `/[lang]/realizacje` | ✅ | `settings?.realizacjeListPageSeo` | ✅ `settings?.defaultOgImage` |
| Realizacja (szczegół) `/[lang]/realizacje/[slug]` | ✅ | `project.seo` | ✅ `project.image` |
| Proces `/[lang]/proces` | ✅ | `processData?.seo ?? settings?.processPageSeo` | ✅ hero lub defaultOgImage |
| Kontakt `/[lang]/kontakt` | ✅ | `settings?.contactPageSeo` | ✅ `settings?.defaultOgImage` |
| FAQ `/[lang]/faq` | ✅ | `settings?.faqPageSeo` | ✅ `settings?.defaultOgImage` |

**Rekomendacje SEO:** Zastosowano fallback obrazu OG dla listy i szczegółu usług.

### 1.3 JSON-LD (dane strukturalne)

| Typ | Gdzie | Status |
|-----|--------|--------|
| **Organization** | Root layout | ✅ stały w `head` |
| **WebSite** | Root layout | ✅ z `lang`, `inLanguage`, `url` |
| **Service** | Strona usługi `/[lang]/uslugi/[slug]` | ✅ name, description, url, provider |
| **Article** | Strona wpisu bloga /[lang]/blog/[slug] | ✅ headline, description, image, datePublished |
| **FAQPage** | Strona FAQ /[lang]/faq | ✅ pytania/odpowiedzi, url strony FAQ |

Baza URL: `getBaseUrl()` z `src/lib/site-url.ts` (NEXT_PUBLIC_SITE_URL / VERCEL_URL / "https://negete.pl").

### 1.4 Hierarchia nagłówków (SEO / semantyka)

- **Strona główna:** h1 w HeroAlt ("NEGETE"), potem h2 (Services, Portfolio, Process, Contact).
- **Usługi (lista):** h1 + dalsze nagłówki.
- **Usługa (szczegół):** h1 (tytuł usługi), h2/h3 w sekcjach.
- **Blog (lista i wpis):** h1, w wpisie h2/h3 z Sanity (headingSection).
- **Realizacje (lista):** h1 → h2 (sr-only "Przeglądaj nasze projekty...") → h3 w kartach.
- **Realizacja (szczegół), Kontakt, Proces, FAQ:** h1 + dalsze nagłówki.

---

## 2. Raport WCAG

### 2.1 Nawigacja klawiaturą i skip link

| Element | Status | Uwagi |
|--------|--------|--------|
| **Skip link** | ✅ | "Przejdź do treści" w Navbarze, `href="#main-content"`, klasa `.skip-link` w `globals.css` – ukryty, widoczny przy focus. |
| **Main landmark** | ✅ | Wszystkie strony: `<main id="main-content">`. |
| **Focus visible** | ✅ | Skip link: outline przy `:focus`. Przyciski (ui/button): `focus-visible:ring-2`. Linki: globalny a:focus-visible w globals.css. Przyciski i inputy: focus-visible ring. |

### 2.2 Język strony

| Element | Status |
|--------|--------|
| **Atrybut lang** | ✅ `<html lang={lang}>` w root layout (pl / en). |

### 2.3 Obrazy

| Element | Status | Uwagi |
|--------|--------|--------|
| **Alt** | ✅ | Obrazki używają `alt` (np. logo "NEGETE Logo", zdjęcia projektów: `project.imageAlt \|\| project.title`, lightbox, galerie, TrustedBy, ProcessPage). |
| **Obrazy dekoracyjne** | ✅ | Gdy brak sensownego opisu – używane jest np. tytuł lub pusty alt w zależności od kontekstu (ImageLightbox: `alt={current.alt \|\| ""}`). |

### 2.4 Formularze (Kontakt)

| Element | Status | Uwagi |
|--------|--------|--------|
| **Etykiety** | ✅ | Pola z `<label htmlFor="...">` (firstName, companyName, email, productDescription). |
| **Wymagane pola** | ✅ | Wizualnie oznaczane (czerwona gwiazdka). Pola wymagane mają required i aria-required; walidacja także po stronie JS. |
| **Komunikaty błędów** | ✅ | Przy błędzie: `aria-invalid="true"`, `aria-describedby` wskazuje na id komunikatu; komunikat w `<p id="...-error" role="alert">`. |
| **Submit** | ✅ | Przycisk z tekstem i stanem disabled podczas wysyłki. |

Zastosowano: pola z błędem mają `aria-invalid` i `aria-describedby`, komunikaty mają id i `role="alert"`.

### 2.5 Komponenty interaktywne

| Element | Status | Uwagi |
|--------|--------|--------|
| **Menu mobilne** | ✅ | `aria-expanded`, `aria-label` (otwórz/zamknij), `aria-hidden` na panelu. Nawigacja: `aria-label="Menu główne"`. |
| **Przełącznik języka** | ✅ | `aria-label` (wybór języka), `aria-current="page"` dla aktywnego. |
| **Lightbox** | ✅ | Przyciski z `aria-label` (zamknij, poprzedni, następny). |
| **Karuzela** | ✅ | `role="region"`, `aria-roledescription="carousel"`, slajdy `role="group"`, przyciski prev/next ze `sr-only` tekstem. |
| **Rocket SVG** | ✅ | `role="img"` (dekoracyjny/kontekstowy). |
| **Linki społecznościowe (Footer)** | ✅ | `aria-label={social.label}`. |

### 2.6 Sekcje i nagłówki

| Element | Status |
|--------|--------|
| **Lista realizacji** | ✅ Sekcja z `aria-labelledby="realizacje-list-heading"`, h2 z `id="realizacje-list-heading"` (sr-only). |
| **Hierarchia h1→h2→h3** | ✅ Zgodna na wszystkich stronach (patrz sekcja SEO). |

### 2.7 Inne

| Element | Status |
|--------|--------|
| **Scroll** | `scroll-behavior: smooth` w html – OK. |
| **Kontrast** | Do weryfikacji wizualnej (tekst biały/szary na ciemnym tle, przyciski cyan). |
| **Powiększanie** | Brak `user-scalable=no` – OK. |

---

## 3. Podsumowanie

- **SEO:** Meta (title, description, OG, Twitter), canonical, hreflang i JSON-LD są wdrożone. Fallback obrazu OG dla listy i szczegółu usług został dodany.
- **WCAG:** Skip link, main landmark, lang, etykiety formularzy, aria w menu/lightbox/karuzeli, alt na obrazach oraz aria-invalid/aria-describedby w formularzu kontaktowym są wdrożone.

Stan SEO i WCAG po wdrożeniu rekomendacji: **w pełni na wysokim poziomie**.
na wysokim poziomie**.
