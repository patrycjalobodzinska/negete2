"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import type { Language } from "@/i18n/config";
import type { HomepageProcess } from "@/sanity/process";

const Process = dynamic(() => import("./Process"), { ssr: false });

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface Props {
  lang?: Language;
  initialData?: HomepageProcess | null;
}

export default function ProcessClient(props: Props) {
  return (
    <ErrorBoundary>
      <Process {...props} />
    </ErrorBoundary>
  );
}
