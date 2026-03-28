import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

type PrelimsIngestItem = {
  ingestKey: string;
  locale: "en" | "hi";
  subject: string;
  topic?: string;
  year: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const http = httpRouter();

auth.addHttpRoutes(http);

/** Apify (or any ETL) POSTs `{ items: PrelimsMcq[] }` with header `x-prelims-ingest-secret`. Set `PRELIMS_INGEST_SECRET` on the Convex deployment. */
http.route({
  path: "/ingest/prelims",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("x-prelims-ingest-secret");
    const expected = process.env.PRELIMS_INGEST_SECRET;
    if (!expected || secret !== expected) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (
      typeof body !== "object" ||
      body === null ||
      !("items" in body) ||
      !Array.isArray((body as { items: unknown }).items)
    ) {
      return new Response(JSON.stringify({ error: "Expected body { items: [...] }" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const items = (body as { items: unknown[] }).items;
    const result = await ctx.runMutation(internal.prelimsPyqs.ingestBatch, {
      items: items as PrelimsIngestItem[],
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
