import { MainsPractice } from "@/components/mains-practice";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mains Evaluation | UPSCMENTOR",
  description: "AI-evaluated GS answers against UPSC-style rubrics.",
};

export default function MainsPage() {
  return <MainsPractice />;
}
