import { ChatMentor } from "@/components/chat-mentor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mentor | UPSCMENTOR",
  description: "UPSC syllabus and strategy Q&A with sourced answers.",
};

export default function ChatPage() {
  return <ChatMentor />;
}
