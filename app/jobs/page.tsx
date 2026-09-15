"use client";

import { useEffect, useState } from "react";
import { persona } from "@/lib/persona";
import type { SearchResult } from "@/lib/googleSearch";
import {
  linkedInCompanySearchUrl,
  linkedInContentSearchUrl,
  linkedInJobSearchUrl,
} from "@/lib/linkedin";

function LinkedInSection() {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        LinkedIn — open in your account
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        These open pre-filled LinkedIn searches in a new tab using your own
        logged-in session (no scraping — LinkedIn&apos;s terms don&apos;t
        allow that).
      </p>

      <div className="mt-4">
        <h3 className="mb-2 text-xs font-medium text-zinc-500">
          Job search by target role
        </h3>
        <div className="flex flex-wrap gap-2">
          {persona.targetRoles.map((role) => (
            <a
              key={role}
              href={linkedInJobSearchUrl(role)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {role} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-2 text-xs font-medium text-zinc-500">
          Startups &amp; companies
        </h3>
        <div className="flex flex-wrap gap-2">
          <a
            href={linkedInCompanySearchUrl("AI agent startup")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
          >
            AI agent startups ↗
          </a>
          <a
            href={linkedInCompanySearchUrl("no-code AI startup")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
          >
            No-code AI startups ↗
          </a>
          <a
            href={linkedInContentSearchUrl("AI startup raises funding")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
          >
            Recent funding posts ↗
          </a>
        </div>
      </div>
    </section>
  );
}

export default function JobsPage() {
  const [query, setQuery] = useState(persona.discoveryQueries[0]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(q: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setUsingSampleData(Boolean(data.usingSampleData));
    } catch {
      setError("Could not run search. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    runSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Startup &amp; job radar
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Recent roles and startups that fit {persona.name.split(" ")[0]}
        &apos;s target roles and aspirations.
      </p>

      <div className="mt-8">
        <LinkedInSection />
      </div>

      <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Startup &amp; funding discovery
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Web search for startups making progress, recent funding rounds, and
          early-stage companies in the AI space.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {persona.discoveryQueries.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                runSearch(q);
              }}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                query === q
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
          className="mt-4 flex gap-3"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Custom search"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
          >
            Search
          </button>
        </form>

        {usingSampleData && (
          <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
            Showing sample data. Add <code>GOOGLE_CSE_API_KEY</code> and{" "}
            <code>GOOGLE_CSE_CX</code> to your <code>.env</code> file to pull
            live search results. See the README for setup instructions.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {loading && <p className="text-sm text-zinc-500">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="text-sm text-zinc-500">
              No results found. Try a different search.
            </p>
          )}
          {results.map((result) => (
            <div
              key={result.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
              >
                {result.title}
              </a>
              <p className="mt-1 text-xs text-zinc-500">{result.source}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {result.snippet}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
