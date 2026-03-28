"use client";

import { ConvexAuthNextProvider } from "@/components/convex-auth-next-provider";
import { LocaleProvider } from "@/contexts/locale-context";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convexClient =
  typeof convexUrl === "string" && convexUrl.length > 0
    ? new ConvexReactClient(convexUrl)
    : null;

export function Providers({ children }: { children: ReactNode }) {
  const inner = (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );

  if (!convexClient) {
    return inner;
  }

  return <ConvexAuthNextProvider client={convexClient}>{inner}</ConvexAuthNextProvider>;
}
