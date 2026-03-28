import type { ChatApiResponse, ChatCitation } from "@/lib/chat-types";
import { NextResponse } from "next/server";

const GROQ_CHAT = "https://api.groq.com/openai/v1/chat/completions";

function parseChatJson(text: string): ChatApiResponse {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/m);
  const jsonStr = fence ? fence[1].trim() : trimmed;
  const parsed = JSON.parse(jsonStr) as { reply?: string; citations?: ChatCitation[] };
  const reply = typeof parsed.reply === "string" ? parsed.reply : trimmed;
  const citations = Array.isArray(parsed.citations)
    ? parsed.citations
        .filter((c): c is ChatCitation => typeof c?.title === "string" && typeof c?.url === "string")
        .slice(0, 8)
    : [];
  return { reply, citations };
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      {
        error: "GROQ_API_KEY is not set on the server.",
        hint: "Add GROQ_API_KEY to .env.local and restart `npm run dev`.",
      },
      { status: 503 },
    );
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = body.messages?.filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim(),
  );
  if (!messages?.length) {
    return NextResponse.json({ error: "At least one user message is required." }, { status: 400 });
  }

  const model = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

  const system = `You are UPSCMENTOR, an expert assistant for UPSC Civil Services (Prelims & Mains) preparation.
Answer clearly and helpfully. Prefer accuracy over length.
When you mention official notifications, syllabus, or results, include a real URL in citations when you know it (e.g. https://upsc.gov.in).
Respond with ONLY valid JSON (no markdown fences) in this exact shape:
{"reply":"your answer as plain text or light markdown","citations":[{"title":"short label","url":"https://..."}]}
The citations array may be empty. Max 5 citations.`;

  const res = await fetch(GROQ_CHAT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.45,
      messages: [
        { role: "system", content: system },
        ...messages.slice(-12).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    return NextResponse.json({ error: "Groq request failed.", detail: raw.slice(0, 400) }, { status: 502 });
  }

  let content: string;
  try {
    const data = JSON.parse(raw) as { choices?: Array<{ message?: { content?: string } }> };
    content = data.choices?.[0]?.message?.content ?? "";
  } catch {
    return NextResponse.json({ error: "Unexpected Groq response." }, { status: 502 });
  }

  if (!content) {
    return NextResponse.json({ error: "Empty model response." }, { status: 502 });
  }

  try {
    const out = parseChatJson(content);
    return NextResponse.json(out);
  } catch {
    return NextResponse.json({ reply: content, citations: [] });
  }
}
