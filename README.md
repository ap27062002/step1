# Apoorva Ankit — Job Search & Insights

A personal Next.js app with three views:

- **Portfolio** (`/`) — aspirations, education, skills, and projects, sourced from `lib/persona.ts`.
- **Jobs** (`/jobs`) — recent job listings matching target roles, pulled from the [Adzuna](https://developer.adzuna.com/) job search API (falls back to sample data if no API key is set). Any listing can be saved directly into the application tracker.
- **Applications** (`/applications`) — a status board (Saved → Applied → Interviewing → Offer / Rejected / Withdrawn) for tracking every application, backed by a local SQLite database via Prisma.

## Getting started

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuring live job search

By default the Jobs page shows sample listings. To get real results:

1. Sign up for a free account at [developer.adzuna.com](https://developer.adzuna.com/).
2. Grab your `App ID` and `App Key` from the dashboard.
3. Add them to `.env`:
   ```
   ADZUNA_APP_ID=your_app_id
   ADZUNA_APP_KEY=your_app_key
   ADZUNA_COUNTRY=in   # or us, gb, etc.
   ```
4. Restart the dev server.

## Updating the portfolio

Edit `lib/persona.ts` — aspirations, education, skills, target roles, and projects all live there and drive the Portfolio page and the default job search keywords.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite for the application tracker
- Adzuna API for job search

## Project structure

```
app/
  page.tsx                     Portfolio page
  jobs/page.tsx                Job search page
  applications/page.tsx        Application status board
  api/jobs/route.ts            Job search API (Adzuna)
  api/applications/route.ts    Application CRUD (list/create)
  api/applications/[id]/route.ts  Application CRUD (update/delete)
lib/
  persona.ts                   Portfolio content
  adzuna.ts                    Job search client
  prisma.ts                    Prisma client singleton
prisma/
  schema.prisma                Application model
```
