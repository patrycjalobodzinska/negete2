import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Safari: mniej szarpania przy obciążonym CPU (ms, klatki)
  gsap.ticker.lagSmoothing(1000, 16);
  // Domyślnie wymuszaj warstwę GPU dla wszystkich animacji (Safari)
  gsap.config({ force3D: true });
}
