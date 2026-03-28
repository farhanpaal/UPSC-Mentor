import { LeaderboardView } from "@/components/leaderboard-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | UPSCMENTOR",
  description: "Top learners by correct MCQs. Search by username.",
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
