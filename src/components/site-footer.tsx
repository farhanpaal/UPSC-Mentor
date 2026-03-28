"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";

export function SiteFooter() {
  const { locale } = useLocale();
  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 py-10">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500 sm:px-6">
        {landingCopy[locale].footer}
      </div>
    </footer>
  );
}
