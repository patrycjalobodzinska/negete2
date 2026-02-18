import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  Code,
  Box,
  Zap,
  Award,
  Factory,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Footer from "../../../components/Footer";
import { getCachedServicesSection, getCachedSiteSettings } from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Code,
  Box,
  Zap,
  Award,
  Factory,
};

interface MockServiceDetail {
  iconKey: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  longDescription: string;
  longDescriptionEn: string;
  features: { title: string; titleEn: string; description: string; descriptionEn: string }[];
  process: { step: string; stepEn: string; description: string; descriptionEn: string }[];
  specs: { label: string; labelEn: string; value: string; valueEn: string }[];
}

const MOCK_SERVICE_DETAILS: MockServiceDetail[] = [
  {
    iconKey: "Cpu",
    title: "Projektowanie Elektroniki & PCB",
    titleEn: "Electronics & PCB Design",
    slug: "projektowanie-pcb",
    description:
      "Schematy ideowe, obwody wielowarstwowe, symulacje oraz projektowanie pod kątem kompatybilności elektromagnetycznej (EMC/EMI).",
    descriptionEn:
      "Schematics, multi-layer circuits, simulations, and design for electromagnetic compatibility (EMC/EMI).",
    longDescription:
      "Projektujemy układy elektroniczne od podstaw, uwzględniając wymagania funkcjonalne, termiczne i elektromagnetyczne. Nasze zespoły pracują z najnowszymi narzędziami EDA (Altium Designer, KiCad), prowadzą symulacje SPICE oraz analizy integralności sygnałów. Każdy projekt przechodzi weryfikację DFM/DFA, co minimalizuje ryzyko błędów w produkcji.",
    longDescriptionEn:
      "We design electronic circuits from scratch, considering functional, thermal, and electromagnetic requirements. Our teams work with the latest EDA tools (Altium Designer, KiCad), run SPICE simulations, and signal integrity analyses. Every design undergoes DFM/DFA verification to minimize production errors.",
    features: [
      {
        title: "Schematy ideowe",
        titleEn: "Schematics",
        description: "Kompletna dokumentacja schematowa zgodna ze standardami IPC.",
        descriptionEn: "Complete schematic documentation compliant with IPC standards.",
      },
      {
        title: "PCB wielowarstwowe",
        titleEn: "Multi-layer PCB",
        description: "Projektowanie obwodów do 16 warstw z kontrolowaną impedancją.",
        descriptionEn: "Circuit design up to 16 layers with controlled impedance.",
      },
      {
        title: "Symulacje EMC/EMI",
        titleEn: "EMC/EMI Simulations",
        description: "Analiza i optymalizacja kompatybilności elektromagnetycznej.",
        descriptionEn: "Analysis and optimization of electromagnetic compatibility.",
      },
      {
        title: "Weryfikacja DFM/DFA",
        titleEn: "DFM/DFA Verification",
        description: "Sprawdzenie projektu pod kątem możliwości produkcyjnych i montażowych.",
        descriptionEn: "Design verification for manufacturing and assembly feasibility.",
      },
    ],
    process: [
      {
        step: "Analiza wymagań",
        stepEn: "Requirements Analysis",
        description: "Szczegółowa specyfikacja techniczna i funkcjonalna.",
        descriptionEn: "Detailed technical and functional specification.",
      },
      {
        step: "Projektowanie schematu",
        stepEn: "Schematic Design",
        description: "Tworzenie schematu ideowego z doborem komponentów.",
        descriptionEn: "Creating schematics with component selection.",
      },
      {
        step: "Layout PCB",
        stepEn: "PCB Layout",
        description: "Rozmieszczenie i trasowanie z uwzględnieniem EMC.",
        descriptionEn: "Placement and routing with EMC considerations.",
      },
      {
        step: "Weryfikacja i testy",
        stepEn: "Verification & Testing",
        description: "Symulacje, przegląd DRC/ERC i prototypowanie.",
        descriptionEn: "Simulations, DRC/ERC review, and prototyping.",
      },
    ],
    specs: [
      { label: "Technologia", labelEn: "Technology", value: "SMD / THT", valueEn: "SMD / THT" },
      { label: "Warstwy PCB", labelEn: "PCB Layers", value: "do 16", valueEn: "up to 16" },
      { label: "Narzędzia EDA", labelEn: "EDA Tools", value: "Altium / KiCad", valueEn: "Altium / KiCad" },
      { label: "Standardy", labelEn: "Standards", value: "IPC-2221 / IPC-7351", valueEn: "IPC-2221 / IPC-7351" },
    ],
  },
  {
    iconKey: "Code",
    title: "Firmware & Embedded",
    titleEn: "Firmware & Embedded",
    slug: "firmware",
    description:
      "Oprogramowanie wbudowane (C/C++), sterowniki mikrokontrolerów, systemy IoT oraz bezpieczna komunikacja bezprzewodowa.",
    descriptionEn:
      "Embedded software (C/C++), microcontroller drivers, IoT systems, and secure wireless communication.",
    longDescription:
      "Tworzymy niezawodne oprogramowanie wbudowane dla mikrokontrolerów (STM32, ESP32, nRF, PIC) oraz systemów embedded Linux. Specjalizujemy się w komunikacji bezprzewodowej (BLE, Wi-Fi, LoRa, Zigbee), protokołach przemysłowych (Modbus, CAN, SPI, I2C) oraz integracji z chmurą (AWS IoT, Azure IoT Hub). Każdy firmware przechodzi testy jednostkowe i integracyjne.",
    longDescriptionEn:
      "We create reliable embedded software for microcontrollers (STM32, ESP32, nRF, PIC) and embedded Linux systems. We specialize in wireless communication (BLE, Wi-Fi, LoRa, Zigbee), industrial protocols (Modbus, CAN, SPI, I2C), and cloud integration (AWS IoT, Azure IoT Hub). Every firmware undergoes unit and integration testing.",
    features: [
      {
        title: "Bare-metal & RTOS",
        titleEn: "Bare-metal & RTOS",
        description: "Programowanie niskopoziomowe oraz systemy czasu rzeczywistego (FreeRTOS, Zephyr).",
        descriptionEn: "Low-level programming and real-time systems (FreeRTOS, Zephyr).",
      },
      {
        title: "Komunikacja bezprzewodowa",
        titleEn: "Wireless Communication",
        description: "BLE, Wi-Fi, LoRa, Zigbee – bezpieczne protokoły IoT.",
        descriptionEn: "BLE, Wi-Fi, LoRa, Zigbee – secure IoT protocols.",
      },
      {
        title: "Bootloadery & OTA",
        titleEn: "Bootloaders & OTA",
        description: "Bezpieczna aktualizacja firmware over-the-air z podpisem cyfrowym.",
        descriptionEn: "Secure over-the-air firmware updates with digital signatures.",
      },
      {
        title: "Integracja z chmurą",
        titleEn: "Cloud Integration",
        description: "AWS IoT, Azure IoT Hub, MQTT, REST API.",
        descriptionEn: "AWS IoT, Azure IoT Hub, MQTT, REST API.",
      },
    ],
    process: [
      {
        step: "Architektura systemu",
        stepEn: "System Architecture",
        description: "Projektowanie architektury oprogramowania i wybór platformy.",
        descriptionEn: "Software architecture design and platform selection.",
      },
      {
        step: "Implementacja",
        stepEn: "Implementation",
        description: "Kodowanie w C/C++ z przestrzeganiem standardów MISRA.",
        descriptionEn: "Coding in C/C++ following MISRA standards.",
      },
      {
        step: "Testy",
        stepEn: "Testing",
        description: "Testy jednostkowe, integracyjne i na docelowym sprzęcie.",
        descriptionEn: "Unit, integration, and on-target hardware testing.",
      },
      {
        step: "Wdrożenie",
        stepEn: "Deployment",
        description: "Przygotowanie do produkcji, dokumentacja i wsparcie.",
        descriptionEn: "Production preparation, documentation, and support.",
      },
    ],
    specs: [
      { label: "Platformy", labelEn: "Platforms", value: "STM32 / ESP32 / nRF", valueEn: "STM32 / ESP32 / nRF" },
      { label: "Języki", labelEn: "Languages", value: "C / C++ / Rust", valueEn: "C / C++ / Rust" },
      { label: "RTOS", labelEn: "RTOS", value: "FreeRTOS / Zephyr", valueEn: "FreeRTOS / Zephyr" },
      { label: "Protokoły", labelEn: "Protocols", value: "BLE / Wi-Fi / LoRa", valueEn: "BLE / Wi-Fi / LoRa" },
    ],
  },
  {
    iconKey: "Box",
    title: "Mechanika & Wzornictwo",
    titleEn: "Mechanical & Industrial Design",
    slug: "mechanika",
    description:
      "Projekty obudów w CAD 3D, dobór materiałów, projektowanie form wtryskowych oraz pełna dokumentacja techniczna 2D/3D.",
    descriptionEn:
      "3D CAD enclosure design, material selection, injection mold design, and full 2D/3D technical documentation.",
    longDescription:
      "Projektujemy obudowy i elementy mechaniczne z wykorzystaniem SolidWorks i Fusion 360. Dobieramy materiały (tworzywa sztuczne, metale, kompozyty), projektujemy formy wtryskowe i przygotowujemy kompletną dokumentację techniczną. Uwzględniamy wymagania IP, ergonomię użytkowania oraz estetykę produktu.",
    longDescriptionEn:
      "We design enclosures and mechanical parts using SolidWorks and Fusion 360. We select materials (plastics, metals, composites), design injection molds, and prepare complete technical documentation. We consider IP requirements, user ergonomics, and product aesthetics.",
    features: [
      {
        title: "Modelowanie 3D",
        titleEn: "3D Modeling",
        description: "Parametryczne modele CAD z pełną historią zmian.",
        descriptionEn: "Parametric CAD models with full change history.",
      },
      {
        title: "Formy wtryskowe",
        titleEn: "Injection Molds",
        description: "Projektowanie form jedno- i wielogniazdowych.",
        descriptionEn: "Single and multi-cavity mold design.",
      },
      {
        title: "Analiza MES/FEA",
        titleEn: "FEA Analysis",
        description: "Symulacje wytrzymałościowe i termiczne.",
        descriptionEn: "Structural and thermal simulations.",
      },
      {
        title: "Dokumentacja 2D",
        titleEn: "2D Documentation",
        description: "Rysunki wykonawcze zgodne z ISO i normami branżowymi.",
        descriptionEn: "Technical drawings compliant with ISO and industry standards.",
      },
    ],
    process: [
      {
        step: "Koncepcja",
        stepEn: "Concept",
        description: "Szkice koncepcyjne i wstępne renderingi.",
        descriptionEn: "Concept sketches and preliminary renders.",
      },
      {
        step: "Modelowanie CAD",
        stepEn: "CAD Modeling",
        description: "Szczegółowy model 3D z doborem materiałów.",
        descriptionEn: "Detailed 3D model with material selection.",
      },
      {
        step: "Symulacje",
        stepEn: "Simulations",
        description: "Analiza MES, symulacje wypływu formy.",
        descriptionEn: "FEA analysis, mold flow simulations.",
      },
      {
        step: "Dokumentacja",
        stepEn: "Documentation",
        description: "Kompletna dokumentacja produkcyjna 2D/3D.",
        descriptionEn: "Complete 2D/3D production documentation.",
      },
    ],
    specs: [
      { label: "Narzędzia CAD", labelEn: "CAD Tools", value: "SolidWorks / Fusion 360", valueEn: "SolidWorks / Fusion 360" },
      { label: "Materiały", labelEn: "Materials", value: "ABS / PC / PA / Aluminium", valueEn: "ABS / PC / PA / Aluminum" },
      { label: "Klasa IP", labelEn: "IP Rating", value: "do IP67", valueEn: "up to IP67" },
      { label: "Tolerancje", labelEn: "Tolerances", value: "od ±0.05 mm", valueEn: "from ±0.05 mm" },
    ],
  },
  {
    iconKey: "Zap",
    title: "Szybkie Prototypowanie",
    titleEn: "Rapid Prototyping",
    slug: "prototypowanie",
    description:
      "Weryfikacja koncepcji poprzez druk 3D, frezowanie CNC oraz montaż próbny układów elektronicznych (PCBA).",
    descriptionEn:
      "Concept verification through 3D printing, CNC milling, and electronic assembly prototyping (PCBA).",
    longDescription:
      "Szybko przekształcamy koncepcje w fizyczne prototypy. Wykorzystujemy druk 3D (FDM, SLA, SLS), frezowanie CNC oraz ręczny montaż PCB. Prototypy pozwalają na wczesną walidację projektu, testy użytkowników i prezentację inwestorom. Czas realizacji od 3 dni roboczych.",
    longDescriptionEn:
      "We quickly transform concepts into physical prototypes. We use 3D printing (FDM, SLA, SLS), CNC milling, and manual PCB assembly. Prototypes enable early design validation, user testing, and investor presentations. Turnaround from 3 business days.",
    features: [
      {
        title: "Druk 3D",
        titleEn: "3D Printing",
        description: "FDM, SLA, SLS – różne materiały i rozdzielczości.",
        descriptionEn: "FDM, SLA, SLS – various materials and resolutions.",
      },
      {
        title: "Frezowanie CNC",
        titleEn: "CNC Milling",
        description: "Precyzyjne elementy z metali i tworzyw.",
        descriptionEn: "Precision parts from metals and plastics.",
      },
      {
        title: "Montaż PCBA",
        titleEn: "PCBA Assembly",
        description: "Ręczny montaż prototypowych płytek PCB.",
        descriptionEn: "Manual assembly of prototype PCBs.",
      },
      {
        title: "Szybka iteracja",
        titleEn: "Fast Iteration",
        description: "Modyfikacje i nowe wersje w ciągu dni.",
        descriptionEn: "Modifications and new versions within days.",
      },
    ],
    process: [
      {
        step: "Przygotowanie plików",
        stepEn: "File Preparation",
        description: "Konwersja modeli CAD i gerberów do formatu produkcyjnego.",
        descriptionEn: "Converting CAD models and Gerbers to production format.",
      },
      {
        step: "Produkcja",
        stepEn: "Production",
        description: "Druk 3D, CNC lub montaż PCB.",
        descriptionEn: "3D printing, CNC, or PCB assembly.",
      },
      {
        step: "Weryfikacja",
        stepEn: "Verification",
        description: "Kontrola wymiarowa i testy funkcjonalne.",
        descriptionEn: "Dimensional inspection and functional testing.",
      },
      {
        step: "Iteracja",
        stepEn: "Iteration",
        description: "Poprawki i optymalizacja na podstawie wyników testów.",
        descriptionEn: "Corrections and optimization based on test results.",
      },
    ],
    specs: [
      { label: "Druk 3D", labelEn: "3D Printing", value: "FDM / SLA / SLS", valueEn: "FDM / SLA / SLS" },
      { label: "CNC", labelEn: "CNC", value: "3-osiowe / 5-osiowe", valueEn: "3-axis / 5-axis" },
      { label: "Czas realizacji", labelEn: "Lead Time", value: "od 3 dni roboczych", valueEn: "from 3 business days" },
      { label: "Materiały", labelEn: "Materials", value: "PLA / ABS / Nylon / Aluminium", valueEn: "PLA / ABS / Nylon / Aluminum" },
    ],
  },
  {
    iconKey: "Award",
    title: "Certyfikacja i Testy",
    titleEn: "Certification & Testing",
    slug: "certyfikacja",
    description:
      "Przygotowanie produktu do oznaczenia znakiem CE, badania wstępne oraz tworzenie dokumentacji wymaganej prawem.",
    descriptionEn:
      "Product preparation for CE marking, pre-compliance testing, and creation of legally required documentation.",
    longDescription:
      "Prowadzimy pełen proces certyfikacji produktów elektronicznych. Przygotowujemy dokumentację techniczną (Technical File), przeprowadzamy badania wstępne EMC i bezpieczeństwa, koordynujemy testy w akredytowanych laboratoriach i wspieramy w uzyskaniu oznaczenia CE, FCC i innych certyfikatów wymaganych na rynkach docelowych.",
    longDescriptionEn:
      "We manage the full certification process for electronic products. We prepare technical documentation (Technical File), conduct pre-compliance EMC and safety testing, coordinate tests in accredited laboratories, and support obtaining CE, FCC, and other certifications required in target markets.",
    features: [
      {
        title: "Badania wstępne EMC",
        titleEn: "Pre-compliance EMC Testing",
        description: "Wczesna identyfikacja problemów z kompatybilnością elektromagnetyczną.",
        descriptionEn: "Early identification of electromagnetic compatibility issues.",
      },
      {
        title: "Dokumentacja techniczna",
        titleEn: "Technical Documentation",
        description: "Technical File zgodny z dyrektywami UE.",
        descriptionEn: "Technical File compliant with EU directives.",
      },
      {
        title: "Testy bezpieczeństwa",
        titleEn: "Safety Testing",
        description: "Badania zgodnie z normami EN 62368, EN 60335.",
        descriptionEn: "Testing according to EN 62368, EN 60335 standards.",
      },
      {
        title: "Oznaczenie CE/FCC",
        titleEn: "CE/FCC Marking",
        description: "Pełne wsparcie w procesie uzyskania certyfikatów.",
        descriptionEn: "Full support in obtaining certification marks.",
      },
    ],
    process: [
      {
        step: "Audyt projektu",
        stepEn: "Design Audit",
        description: "Przegląd projektu pod kątem zgodności z normami.",
        descriptionEn: "Design review for standards compliance.",
      },
      {
        step: "Badania wstępne",
        stepEn: "Pre-compliance Testing",
        description: "Testy EMC i bezpieczeństwa we własnym laboratorium.",
        descriptionEn: "EMC and safety tests in our own laboratory.",
      },
      {
        step: "Testy akredytowane",
        stepEn: "Accredited Testing",
        description: "Koordynacja testów w akredytowanym laboratorium.",
        descriptionEn: "Coordination of tests in an accredited laboratory.",
      },
      {
        step: "Certyfikacja",
        stepEn: "Certification",
        description: "Wydanie deklaracji zgodności i dokumentacji.",
        descriptionEn: "Issuing declaration of conformity and documentation.",
      },
    ],
    specs: [
      { label: "Certyfikaty", labelEn: "Certifications", value: "CE / FCC / UL", valueEn: "CE / FCC / UL" },
      { label: "Normy EMC", labelEn: "EMC Standards", value: "EN 55032 / EN 55035", valueEn: "EN 55032 / EN 55035" },
      { label: "Bezpieczeństwo", labelEn: "Safety", value: "EN 62368-1", valueEn: "EN 62368-1" },
      { label: "Dyrektywy", labelEn: "Directives", value: "LVD / RED / RoHS", valueEn: "LVD / RED / RoHS" },
    ],
  },
  {
    iconKey: "Factory",
    title: "Produkcja Seryjna",
    titleEn: "Serial Production",
    slug: "produkcja",
    description:
      "Organizacja łańcucha dostaw, nadzór nad produkcją elektroniki, kontrola jakości i skalowanie produkcji.",
    descriptionEn:
      "Supply chain organization, electronics production supervision, quality control, and production scaling.",
    longDescription:
      "Zarządzamy procesem produkcji seryjnej od zamówienia komponentów po dostawę gotowego produktu. Organizujemy łańcuch dostaw, nadzorujemy montaż SMT/THT, wdrażamy kontrolę jakości (AOI, ICT, FCT) i koordynujemy logistykę. Współpracujemy z zaufanymi fabrykami w Polsce i Azji.",
    longDescriptionEn:
      "We manage serial production from component ordering to finished product delivery. We organize the supply chain, supervise SMT/THT assembly, implement quality control (AOI, ICT, FCT), and coordinate logistics. We work with trusted factories in Poland and Asia.",
    features: [
      {
        title: "Zarządzanie BOM",
        titleEn: "BOM Management",
        description: "Optymalizacja listy materiałowej i zarządzanie komponentami.",
        descriptionEn: "Bill of materials optimization and component management.",
      },
      {
        title: "Montaż SMT/THT",
        titleEn: "SMT/THT Assembly",
        description: "Nadzór nad produkcją i montażem płytek PCB.",
        descriptionEn: "Supervision of PCB production and assembly.",
      },
      {
        title: "Kontrola jakości",
        titleEn: "Quality Control",
        description: "AOI, ICT, FCT – wieloetapowa weryfikacja.",
        descriptionEn: "AOI, ICT, FCT – multi-stage verification.",
      },
      {
        title: "Logistyka",
        titleEn: "Logistics",
        description: "Koordynacja dostaw od dostawców do klienta końcowego.",
        descriptionEn: "Coordination of deliveries from suppliers to end customer.",
      },
    ],
    process: [
      {
        step: "Planowanie produkcji",
        stepEn: "Production Planning",
        description: "Harmonogram, zamówienie komponentów, przygotowanie linii.",
        descriptionEn: "Schedule, component ordering, line preparation.",
      },
      {
        step: "Montaż",
        stepEn: "Assembly",
        description: "Produkcja PCB, montaż SMT/THT, lutowanie.",
        descriptionEn: "PCB production, SMT/THT assembly, soldering.",
      },
      {
        step: "Testy produkcyjne",
        stepEn: "Production Testing",
        description: "AOI, ICT, testy funkcjonalne każdej sztuki.",
        descriptionEn: "AOI, ICT, functional testing of each unit.",
      },
      {
        step: "Dostawa",
        stepEn: "Delivery",
        description: "Pakowanie, etykietowanie i wysyłka do klienta.",
        descriptionEn: "Packaging, labeling, and shipping to customer.",
      },
    ],
    specs: [
      { label: "Montaż", labelEn: "Assembly", value: "SMT / THT / mieszany", valueEn: "SMT / THT / mixed" },
      { label: "Testy", labelEn: "Testing", value: "AOI / ICT / FCT", valueEn: "AOI / ICT / FCT" },
      { label: "Skala", labelEn: "Scale", value: "od 100 do 100 000+ szt.", valueEn: "from 100 to 100,000+ pcs" },
      { label: "Lokalizacja", labelEn: "Location", value: "Polska / Azja", valueEn: "Poland / Asia" },
    ],
  },
];

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (!languages.includes(lang as Language)) return {};
  const [settings, servicesData] = await Promise.all([
    getCachedSiteSettings(lang as Language),
    getCachedServicesSection(lang as Language),
  ]);
  const service = servicesData?.services?.find((s) => s.slug === slug);
  const mockService = MOCK_SERVICE_DETAILS.find((s) => s.slug === slug);
  const title =
    service?.title ||
    (lang === "en" ? mockService?.titleEn : mockService?.title) ||
    slug;
  const description =
    service?.description ||
    (lang === "en" ? mockService?.descriptionEn : mockService?.description);
  return buildMetadata({
    title,
    description,
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/uslugi/${slug}`,
  });
}

export default async function UslugaDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const servicesData = await getCachedServicesSection(lang as Language);

  // Try matching Sanity service by slug, or by index if Sanity services have no slug
  const sanityService =
    servicesData?.services?.find((s) => s.slug === slug) ||
    servicesData?.services?.find(
      (_s, i) =>
        !_s.slug &&
        MOCK_SERVICE_DETAILS[i]?.slug === slug
    );
  const mockService = MOCK_SERVICE_DETAILS.find((s) => s.slug === slug);

  if (!sanityService && !mockService) {
    notFound();
  }

  const isEn = lang === "en";

  // Use Sanity data if available, otherwise use mock
  const title = sanityService?.title || (isEn ? mockService?.titleEn : mockService?.title) || slug;
  const description =
    sanityService?.description || (isEn ? mockService?.descriptionEn : mockService?.description) || "";
  const iconKey = sanityService?.iconKey || mockService?.iconKey || "Cpu";
  const IconComponent = SERVICE_ICONS[iconKey] || Cpu;

  // Mock-specific rich content
  const longDescription = isEn ? mockService?.longDescriptionEn : mockService?.longDescription;
  const features = mockService?.features;
  const processSteps = mockService?.process;
  const specs = mockService?.specs;

  // Find related services (exclude current)
  const allServices = MOCK_SERVICE_DETAILS.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <main className="relative min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Back link */}
        <Link
          href={`/${lang}/uslugi`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t(lang as Language, "common.allServices")}
        </Link>

        {/* Hero */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/20">
              <IconComponent className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
            {description}
          </p>
        </header>

        {/* Long description */}
        {longDescription && (
          <section className="mb-16">
            <div className="border-l-4 border-cyan-400/40 pl-6">
              <p className="text-gray-300 text-lg leading-relaxed">{longDescription}</p>
            </div>
          </section>
        )}

        {/* Features */}
        {features && features.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              {isEn ? "What we offer" : "Co oferujemy"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium mb-1">
                        {isEn ? feature.titleEn : feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {isEn ? feature.descriptionEn : feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Process */}
        {processSteps && processSteps.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              {isEn ? "How we work" : "Jak pracujemy"}
            </h2>
            <div className="space-y-4">
              {processSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-5 p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                    <span className="text-cyan-400 text-sm font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {isEn ? step.stepEn : step.step}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {isEn ? step.descriptionEn : step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Specs */}
        {specs && specs.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8">
              {isEn ? "Technical specifications" : "Specyfikacja techniczna"}
            </h2>
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              {specs.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center px-6 py-4 ${
                    idx !== specs.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <span className="text-gray-400 text-sm">
                    {isEn ? spec.labelEn : spec.label}
                  </span>
                  <span className="text-white font-medium text-sm">
                    {isEn ? spec.valueEn : spec.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mb-16">
          <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              {isEn ? "Interested in this service?" : "Zainteresowany tą usługą?"}
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              {isEn
                ? "Contact us to discuss how we can help bring your project to life."
                : "Skontaktuj się z nami, aby omówić jak możemy pomóc w realizacji Twojego projektu."}
            </p>
            <Link
              href={`/${lang}/kontakt`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-xl transition-colors"
            >
              {isEn ? "Contact us" : "Skontaktuj się"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Related services */}
        {allServices.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-white mb-8">
              {isEn ? "Other services" : "Pozostałe usługi"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {allServices.map((related, idx) => {
                const RelatedIcon = SERVICE_ICONS[related.iconKey] || Cpu;
                return (
                  <Link
                    key={idx}
                    href={`/${lang}/uslugi/${related.slug}`}
                    className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                  >
                    <div className="p-2.5 rounded-lg bg-white/10 w-fit mb-3 group-hover:bg-cyan-500/10 transition-colors">
                      <RelatedIcon className="w-5 h-5 text-white group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <h3 className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors">
                      {isEn ? related.titleEn : related.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom back link */}
        <div className="mt-20 pt-12 border-t border-white/5">
          <Link
            href={`/${lang}/uslugi`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(lang as Language, "common.allServices")}
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
