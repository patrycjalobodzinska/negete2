"use client";

import "@/lib/gsap";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import SmoothScroll from "./SmoothScroll";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
