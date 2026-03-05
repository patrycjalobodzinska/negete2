import {
  Cpu,
  Code,
  Box,
  Zap,
  Award,
  Factory,
  Rocket,
  Wrench,
  Settings,
  Mail,
  Phone,
  Building2,
  FileCode,
  CircuitBoard,
  Cog,
  Layout,
  Package,
  Truck,
  Shield,
  CheckCircle2,
  Star,
  Sparkles,
  Microchip,
  Boxes,
  Hammer,
  FlaskConical,
  TestTube,
  PenTool,
  Ruler,
  type LucideIcon,
} from "lucide-react";

/** Mapa ikon dostępnych w Sanity – każda musi być jawnie zaimportowana (tree-shaking). */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  Cpu,
  Code,
  Box,
  Zap,
  Award,
  Factory,
  Rocket,
  Wrench,
  Settings,
  Mail,
  Phone,
  Building2,
  FileCode,
  CircuitBoard,
  Cog,
  Layout,
  Package,
  Truck,
  Shield,
  CheckCircle2,
  Star,
  Sparkles,
  Microchip,
  Boxes,
  Hammer,
  FlaskConical,
  TestTube,
  PenTool,
  Ruler,
};

export function getServiceIcon(iconKey: string | null | undefined): LucideIcon {
  if (!iconKey || typeof iconKey !== "string") return Cpu;
  const name = iconKey.trim();
  if (!name) return Cpu;
  const exact = SERVICE_ICONS[name];
  if (exact) return exact;
  const pascal = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return SERVICE_ICONS[pascal] ?? Cpu;
}
