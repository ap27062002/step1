"use client";

import { useEffect, useState } from "react";
import { persona } from "@/lib/persona";
import type { JobResult } from "@/lib/adzuna";

export default function JobsPage() {
  const [what, setWhat] = useState(persona.targetRoles[0]);
  const [where, setWhere] = useState("");
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [saveError, setSaveError] = useState<string | null>(null);

  async function runSearch(searchWhat: string, searchWhere: string) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ what: searchWhat });
      if (searchWhere) params.set("where", searchWhere);
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setUsingSampleData(Boolean(data.usingSampleData));
    } catch {
      setError("Could not fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    runSearch(what, where);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveJob(job: JobResult) {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        source: job.source,
        salary: job.salary,
        status: "SAVED",
      }),
    });
    if (res.ok) {
      setSavedIds((prev) => new Set(prev).add(job.id));
      setSaveError(null);
    } else {
      const data = await res.json().catch(() => null);
      setSaveError(data?.error ?? "Could not save this job. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Recent related jobs</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Searching for roles matching {persona.name.split(" ")[0]}&apos;s
        target roles.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {persona.targetRoles.map((role) => (
          <button
            key={role}
            onClick={() => {
              setWhat(role);
              runSearch(role, where);
            }}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              what === role
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(what, where);
        }}
        className="mt-6 flex flex-wrap gap-3"
      >
        <input
          value={what}
          onChange={(e) => setWhat(e.target.value)}
          placeholder="Keywords / role"
          className="flex-1 min-w-[200px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Location (optional)"
          className="flex-1 min-w-[160px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
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
          Showing sample data. Add <code>ADZUNA_APP_ID</code> and{" "}
          <code>ADZUNA_APP_KEY</code> to your <code>.env</code> file to pull
          live job listings. See the README for signup instructions.
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {saveError && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {saveError}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading && (
          <p className="text-sm text-zinc-500">Loading jobs…</p>
        )}
        {!loading && jobs.length === 0 && (
          <p className="text-sm text-zinc-500">No jobs found. Try a different search.</p>
        )}
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  {job.title}
                </a>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {job.company} · {job.location}
                </p>
                {job.salary && (
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                    {job.salary}
                  </p>
                )}
              </div>
              <button
                onClick={() => saveJob(job)}
                disabled={savedIds.has(job.id)}
                className="shrink-0 rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                {savedIds.has(job.id) ? "Saved" : "Save to tracker"}
              </button>
            </div>
            {job.description && (
              <p className="mt-3 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                {job.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
