import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UPSCMENTOR — Free AI-Powered UPSC Preparation",
  description:
    "MCQs from previous papers, AI Mains evaluation, streaks, analytics, and an intelligent mentor — built for every aspirant.",
  keywords: ["UPSC", "Civil Services", "Prelims", "Mains", "AI", "free preparation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`} suppressHydrationWarning>
      <body
        className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)] antialiased"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
