# UPSCMENTOR

UPSCMENTOR is built for one audience: people grinding for the UPSC Civil Services examination who want serious tools without the price tag of a full coaching stack. It wraps Prelims practice, Mains writing drills, and a light layer of motivation—streaks, history, a leaderboard—into a single calm, fast web app you can open on a phone or laptop between classes, work, or library sessions.

On the Prelims side, you work the way many toppers actually revise: short subject tests, a longer timed mock, and a dedicated pass over questions you missed the last time, so weak spots surface naturally instead of vanishing into a generic question bank. The interface is available in English and Hindi, and the question pool can grow from bundled seed content or your own Convex-backed data—so the product stays useful as your sources expand.

For Mains, the app stops pretending that “more pages” equals progress. You answer GS-style prompts drawn by paper, get structured feedback and indicative marks through Groq, and step forward to a fresh question when you are ready—keeping the loop tight: write, reflect, repeat. Sign in, and your effort feeds a dashboard of accuracy and history plus a leaderboard that honours both MCQ rigour and Mains marks, so one honest session in either paper still moves the needle.

Under the hood it is Next.js and Convex—modern, real-time, and straightforward to deploy—so the story stays about the aspirant, not the stack. UPSCMENTOR is for anyone who wants disciplined practice, honest feedback on prose, and a sense of forward motion on the long road to the services.

**Tech Stack** Cursor, convex, Exa, Apify.

## Features

| Area | What it does |
|------|----------------|
| **MCQ practice** | Subject-wise 10-question sets, 60-minute mock, optional “incorrect review” from your latest wrong attempts |
| **Mains** | GS-style prompts by paper; structured feedback and marks; scores roll into leaderboard totals when signed in |
| **Dashboard** | Streaks, history, subject accuracy, profile (public handle for leaderboard) |
| **Leaderboard** | Ranked by MCQ correct + Mains marks; search by name/username |
| **Auth** | Convex Auth — email/password and optional Google OAuth |
| **UI** | English + Hindi copy, light/dark theme, mobile-friendly layout |

## Tech stack

- **Frontend:** [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript, Tailwind CSS 4, `next-themes`
- **Backend:** [Convex](https://convex.dev) (database, queries, mutations, HTTP routes)
- **Auth:** `@convex-dev/auth`
- **AI (Next.js API routes):** [Groq](https://groq.com) for Mains evaluation and chat completions

## Prerequisites

- **Node.js** 20+ and **npm**
- A **Convex** account ([convex.dev](https://convex.dev))
- A **Groq API key** ([console.groq.com/keys](https://console.groq.com/keys)) for Mains eval and chat (local dev)

## Clone and install

```bash
git clone <your-repo-url>
cd UPSCMENTOR
npm install
```

## Run locally

You typically run **two processes**: Convex (backend sync) and Next.js (frontend).

### 1. Environment file (Next.js)

Copy the example file and edit it:

```bash
cp .env.local.example .env.local
```

Set at least:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | **Yes** | Your Convex deployment URL (e.g. `https://your-team.convex.cloud`) |
| `GROQ_API_KEY` | For Mains + chat | Server-side; starts with `gsk_` |
| `GROQ_MODEL` | No | Defaults to `llama-3.3-70b-versatile` |

Optional (only if you use those integrations):

- `PRELIMS_INGEST_SECRET` — set on **Convex**, not in Next.js; used by the HTTP ingest route
- `EXA_API_KEY`, `APIFY_TOKEN` — reserved for future or custom pipelines; not required for core flows

**Never commit** `.env.local` or real keys. It should stay gitignored.

### 2. Convex project and dev server

Log in and start Convex (pushes functions and schema, gives you a deployment URL):

```bash
npx convex dev
```

Copy the printed deployment URL into `NEXT_PUBLIC_CONVEX_URL` in `.env.local`, then restart `npx convex dev` if needed so the client and backend stay aligned.

### 3. Convex Auth (JWT) — required for sign-in

Email/password (and OAuth token exchange) **will fail** until JWT settings exist on the **Convex deployment** (dashboard or CLI), not only in Next.js.

1. Generate key material (writes to `secrets/`, which is gitignored):

   ```bash
   npm run generate-jwt-keys
   ```

2. Upload to Convex (**use `--from-file` for the PEM** so newlines are preserved):

   ```bash
   npx convex env set JWT_PRIVATE_KEY --from-file secrets/convex-jwt-private.pem
   npx convex env set JWKS --from-file secrets/convex-jwks.json
   ```

3. Set URLs on the same deployment:

   ```bash
   npx convex env set SITE_URL http://localhost:3000
   npx convex env set CONVEX_SITE_URL https://YOUR_DEPLOYMENT.convex.cloud
   ```

   Replace `YOUR_DEPLOYMENT` with your actual Convex deployment hostname from the dashboard. For production, set `SITE_URL` to your live site URL.

You can also paste **JWT_PRIVATE_KEY** and **JWKS** in the Convex dashboard under **Settings → Environment variables**.

### 4. Seed the Prelims question bank (once per deployment)

Idempotent upsert from built-in seed data:

```bash
npm run convex:seed-prelims
```

### 5. Start Next.js

In a **second terminal**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up / sign in, then use **MCQ Practice**, **Mains**, **Dashboard**, and **Leaderboard**.

### Quick command summary

```bash
# Terminal A — Convex
npx convex dev

# Terminal B — Next.js (after .env.local is set)
npm run dev
```

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build / run |
| `npm run lint` | ESLint |
| `npx convex dev` | Convex dev sync (schema + functions) |
| `npm run convex:seed-prelims` | Seed `prelimsPyqs` from `convex/seed/prelimsData.ts` |
| `npm run generate-jwt-keys` | Generate JWT PEM + JWKS for Convex Auth |

## Project layout (high level)

```
src/app/           # Next.js App Router pages & API routes (/api/mains-eval, /api/chat)
src/components/    # UI (practice, mains, dashboard, leaderboard, shell, theme)
src/contexts/      # Locale (en/hi)
convex/            # Convex schema, queries, mutations, auth, HTTP routes
convex/seed/       # Static MCQ + Mains seed content
```

Convex agent guidelines for this repo: see `convex/_generated/ai/guidelines.md` when changing backend code.

## Adding more MCQs

Questions live in the `prelimsPyqs` table. Each row needs a stable **`ingestKey`** so re-imports upsert cleanly.

1. **Dashboard → Data → `prelimsPyqs` → Insert** (see `.env.local.example` / Convex schema for field shapes).
2. **Code:** add entries to `convex/seed/prelimsData.ts` (`PRELIMS_BANK_EN` / `PRELIMS_BANK_HI`), then run `npm run convex:seed-prelims`.
3. **HTTP ingest:** `POST` to `https://<deployment>.convex.site/ingest/prelims` with header `x-prelims-ingest-secret` matching Convex env `PRELIMS_INGEST_SECRET`, body `{ "items": [ … ] }` (see `convex/http.ts`).

`subject` must match GS labels used in the app (e.g. `Polity`, `Economy`, …).

## Optional: Google OAuth

Set on Convex:

```bash
npx convex env set AUTH_GOOGLE_ID "<client-id>"
npx convex env set AUTH_GOOGLE_SECRET "<client-secret>"
```

Google Cloud Console callback URL pattern:

`https://YOUR_DEPLOYMENT.convex.site/api/auth/callback/google`

## Deploying

- **Convex:** `npx convex deploy` (or connect the GitHub integration in the Convex dashboard). Re-apply environment variables on production.
- **Frontend (e.g. Vercel):** set `NEXT_PUBLIC_CONVEX_URL`, `GROQ_API_KEY`, and any other Next.js env vars; set Convex `SITE_URL` to your production domain.

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| `Missing JWT_PRIVATE_KEY` / sign-in errors | JWT + JWKS + `SITE_URL` + `CONVEX_SITE_URL` on **Convex** |
| Blank Convex / auth UI | `NEXT_PUBLIC_CONVEX_URL` in `.env.local`; restart `npm run dev` |
| Mains / chat “no API key” | `GROQ_API_KEY` in `.env.local`; restart Next.js |
| Hydration warnings on `<body>` | Often browser extensions; layout uses `suppressHydrationWarning` where needed |

## Fonts

The app uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for **Syne** (display) and **DM Sans** (body).

## License

Add a `LICENSE` file in the repo root if you want an explicit open-source license; this `README` does not impose one.

---

**UPSCMENTOR** — stack: Convex · Groq · Next.js
