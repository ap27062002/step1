# Apoorva Ankit — Job Search & Insights

A personal Next.js app with two views:

- **Portfolio** (`/`) — aspirations, education, skills, and projects, sourced from `lib/persona.ts`.
- **Jobs** (`/jobs`) — a startup & job radar with three parts:
  - **LinkedIn deep-links** — one-click search URLs (job search by target role, startup/company search, recent funding posts) that open in your own logged-in LinkedIn tab. This does not scrape LinkedIn — its Terms of Service prohibit that and actively enforce it.
  - **Startup & funding discovery** — a web search feed (via the [Tavily](https://tavily.com) search API) surfacing startups making progress, recent funding rounds, and early-stage companies in the AI space, driven by curated queries in `lib/persona.ts`.
  - **Reach out** — on any discovery result, look up likely contacts (founders, execs, hiring leads) at the startup's domain via [Hunter.io](https://hunter.io), then open a pre-filled outreach email to them in your own mail client (a `mailto:` link — nothing is sent automatically, you review and hit send yourself).

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

## Configuring the "Reach out" contact lookup

By default it shows sample contacts. To get live results:

1. Sign up free at [hunter.io](https://hunter.io) (25 domain searches/month free tier) and copy your API key.
2. Add it to `.env`:
   ```
   HUNTER_API_KEY=your_api_key
   ```
3. Restart the dev server (or add it as an Environment Variable in Vercel and redeploy).

The domain field on each result is a best-effort guess (from the article's own domain, or the startup name mentioned in its title) — always double-check it before searching, since discovery results are often news articles about a startup rather than the startup's own site.

## Updating the portfolio

Edit `lib/persona.ts` — aspirations, education, skills, target roles, and the curated discovery search queries all live there.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Tavily search API for startup/funding discovery
- Hunter.io for contact lookup

## Project structure

```
app/
  page.tsx                Portfolio page
  jobs/page.tsx            LinkedIn deep-links + startup/funding discovery
  jobs/ReachOutPanel.tsx   Per-result contact lookup + outreach email
  api/search/route.ts      Web search API (Tavily)
  api/contacts/route.ts    Contact lookup API (Hunter.io)
lib/
  persona.ts               Portfolio content + discovery queries
  linkedin.ts              LinkedIn search deep-link builders
  tavily.ts                Tavily search client
  hunter.ts                Hunter.io contact lookup client
  domainGuess.ts           Best-effort startup domain guesser
  emailTemplate.ts         Builds the mailto: outreach link
```
