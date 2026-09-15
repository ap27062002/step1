# Apoorva Ankit — Job Search & Insights

A personal Next.js app with two views:

- **Portfolio** (`/`) — aspirations, education, skills, and projects, sourced from `lib/persona.ts`.
- **Jobs** (`/jobs`) — a startup & job radar with two parts:
  - **LinkedIn deep-links** — one-click search URLs (job search by target role, startup/company search, recent funding posts) that open in your own logged-in LinkedIn tab. This does not scrape LinkedIn — its Terms of Service prohibit that and actively enforce it.
  - **Startup & funding discovery** — a web search feed (via the [Tavily](https://tavily.com) search API) surfacing startups making progress, recent funding rounds, and early-stage companies in the AI space, driven by curated queries in `lib/persona.ts`.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuring live startup/funding search

By default the discovery feed shows sample results. To get live results:

1. Sign up free at [tavily.com](https://tavily.com) (1,000 searches/month free tier) and copy your API key.
2. Add it to `.env`:
   ```
   TAVILY_API_KEY=your_api_key
   ```
3. Restart the dev server (or add it as an Environment Variable in Vercel and redeploy).

## Updating the portfolio

Edit `lib/persona.ts` — aspirations, education, skills, target roles, and the curated discovery search queries all live there.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Tavily search API for startup/funding discovery

## Project structure

```
app/
  page.tsx                Portfolio page
  jobs/page.tsx            LinkedIn deep-links + startup/funding discovery
  api/search/route.ts      Web search API (Tavily)
lib/
  persona.ts               Portfolio content + discovery queries
  linkedin.ts               LinkedIn search deep-link builders
  tavily.ts                 Tavily search client
```
