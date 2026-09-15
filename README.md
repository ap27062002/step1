# Apoorva Ankit — Job Search & Insights

A personal Next.js app with three views:

- **Portfolio** (`/`) — aspirations, education, skills, and projects, sourced from `lib/persona.ts`.
- **Jobs** (`/jobs`) — recent job listings matching target roles, pulled from the [Adzuna](https://developer.adzuna.com/) job search API (falls back to sample data if no API key is set). Any listing can be saved directly into the application tracker.
- **Applications** (`/applications`) — a status board (Saved → Applied → Interviewing → Offer / Rejected / Withdrawn) for tracking every application, backed by SQLite via Prisma (a local file in dev, hosted [Turso](https://turso.tech) in production).

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

## Deploying to Vercel

Vercel's serverless functions have a read-only filesystem, so the local `dev.db`
SQLite file won't work in production. Use a free [Turso](https://turso.tech)
database instead:

1. Install the Turso CLI and sign in: `curl -sSfL https://get.tur.so/install.sh | bash`, then `turso auth login`.
2. Create a database: `turso db create job-tracker`.
3. Apply the schema: `turso db shell job-tracker < prisma/migrations/20260915181040_init/migration.sql`.
4. Get the connection details:
   - `turso db show job-tracker --url` → `TURSO_DATABASE_URL`
   - `turso db tokens create job-tracker` → `TURSO_AUTH_TOKEN`
5. In the Vercel dashboard → Project → Settings → Environment Variables, add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` (and optionally `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` / `ADZUNA_COUNTRY` for live job search).
6. Push to the branch connected to your Vercel project (or click **Redeploy** in the dashboard) to trigger a deployment.

Locally, `npm run dev` keeps using the file-based SQLite database unless `TURSO_DATABASE_URL` is also set in your `.env`.

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
