import { PracticeView } from "@/components/practice-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCQ Practice | UPSCMENTOR",
  description: "Previous-year UPSC Prelims MCQs with filters and timed mocks.",
};

export default function PracticePage() {
  return <PracticeView />;
}
