# Apoorva Ankit — Job Search & Insights

A personal Next.js app with two views:

- **Portfolio** (`/`) — aspirations, education, skills, and projects, sourced from `lib/persona.ts`.
- **Jobs** (`/jobs`) — a startup & job radar with two parts:
  - **LinkedIn deep-links** — one-click search URLs (job search by target role, startup/company search, recent funding posts) that open in your own logged-in LinkedIn tab. This does not scrape LinkedIn — its Terms of Service prohibit that and actively enforce it.
  - **Startup & funding discovery** — a web search feed (via the Google Custom Search API) surfacing startups making progress, recent funding rounds, and early-stage companies in the AI space, driven by curated queries in `lib/persona.ts`.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuring live startup/funding search

By default the discovery feed shows sample results. To get live results:

1. Enable the "Custom Search API" in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and create an API key.
2. Create a search engine (configured to search the whole web) at [programmablesearchengine.google.com](https://programmablesearchengine.google.com/) and copy its Search Engine ID.
3. Add both to `.env`:
   ```
   GOOGLE_CSE_API_KEY=your_api_key
   GOOGLE_CSE_CX=your_search_engine_id
   ```
4. Restart the dev server (or add both as Environment Variables in Vercel and redeploy).

## Updating the portfolio

Edit `lib/persona.ts` — aspirations, education, skills, target roles, and the curated discovery search queries all live there.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Google Custom Search API for startup/funding discovery

## Project structure

```
app/
  page.tsx                Portfolio page
  jobs/page.tsx            LinkedIn deep-links + startup/funding discovery
  api/search/route.ts      Web search API (Google Custom Search)
lib/
  persona.ts               Portfolio content + discovery queries
  linkedin.ts               LinkedIn search deep-link builders
  googleSearch.ts           Google Custom Search client
```
