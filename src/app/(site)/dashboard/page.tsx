import { DashboardView } from "@/components/dashboard-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | UPSCMENTOR",
  description: "Accuracy, heatmaps, weaknesses, and readiness scores.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
