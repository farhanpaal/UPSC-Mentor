import type { MainsEvalResult } from "@/lib/mains-eval-types";
import { NextResponse } from "next/server";

const GROQ_CHAT = "https://api.groq.com/openai/v1/chat/completions";

function parseJsonFromAssistantText(text: string): MainsEvalResult {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/m);
  const jsonStr = fence ? fence[1].trim() : trimmed;
  const parsed = JSON.parse(jsonStr) as MainsEvalResult;
  if (
    typeof parsed.score !== "number" ||
    typeof parsed.maxScore !== "number" ||
    typeof parsed.summary !== "string"
  ) {
    throw new Error("Invalid evaluation shape");
  }
  return {
    score: parsed.score,
    maxScore: parsed.maxScore,
    summary: parsed.summary,
    structure: typeof parsed.structure === "string" ? parsed.structure : "",
    contentDepth: typeof parsed.contentDepth === "string" ? parsed.contentDepth : "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      {
        error: "GROQ_API_KEY is not set on the server.",
        hint: "Create or edit .env.local in the project root, add GROQ_API_KEY=gsk_... (from https://console.groq.com/keys ), then restart `npm run dev`. For production, set the same variable in your host (e.g. Vercel → Environment Variables).",
      },
      { status: 503 },
    );
  }

  let body: { question?: string; answer?: string; maxMarks?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const question = body.question?.trim();
  const answer = body.answer?.trim();
  if (!question || !answer) {
    return NextResponse.json({ error: "Both question and answer are required." }, { status: 400 });
  }

  const maxMarks = body.maxMarks === 10 || body.maxMarks === 15 || body.maxMarks === 20 ? body.maxMarks : 15;

  const model =
    process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

  const system = `You are an expert evaluator for UPSC Civil Services Mains (General Studies style).
Score answers out of the given maximum marks. Be fair, concise, and aligned with how UPSC rewards structure, multidimensional analysis, examples, and relevance.
You must respond with ONLY valid JSON (no markdown outside JSON) using this exact shape:
{
  "score": number,
  "maxScore": number,
  "summary": string,
  "structure": string,
  "contentDepth": string,
  "strengths": string[],
  "improvements": string[]
}
Use "maxScore" equal to the question's stated maximum marks. "score" must be between 0 and maxScore.`;

  const user = `Maximum marks for this question: ${maxMarks}.

Question:
${question}

Candidate answer:
${answer}

Evaluate introduction/body/conclusion (if applicable), relevance, balance, examples, and adherence to the expected length for this mark category. Return JSON only.`;

  const res = await fetch(GROQ_CHAT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    return NextResponse.json(
      { error: "Groq request failed.", detail: raw.slice(0, 500) },
      { status: 502 },
    );
  }

  let content: string;
  try {
    const data = JSON.parse(raw) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    content = data.choices?.[0]?.message?.content ?? "";
  } catch {
    return NextResponse.json({ error: "Unexpected Groq response.", detail: raw.slice(0, 300) }, { status: 502 });
  }

  if (!content) {
    return NextResponse.json({ error: "Empty model response." }, { status: 502 });
  }

  try {
    const evaluation = parseJsonFromAssistantText(content);
    evaluation.maxScore = maxMarks;
    if (evaluation.score > maxMarks) evaluation.score = maxMarks;
    if (evaluation.score < 0) evaluation.score = 0;
    return NextResponse.json(evaluation);
  } catch {
    return NextResponse.json(
      {
        error: "Could not parse model output as JSON.",
        raw: content.slice(0, 4000),
      },
      { status: 502 },
    );
  }
}
