"use client";

import type { ReactNode } from "react";
import { AppBackground } from "./app-background";
import { AuthBanner } from "./auth-banner";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <AppBackground />
      <SiteHeader />
      <AuthBanner />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  );
}
