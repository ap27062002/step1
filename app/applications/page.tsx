"use client";

import { useEffect, useState } from "react";

type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

type Application = {
  id: string;
  jobTitle: string;
  company: string;
  location: string | null;
  url: string | null;
  source: string;
  status: ApplicationStatus;
  salary: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const COLUMNS: { key: ApplicationStatus; label: string }[] = [
  { key: "SAVED", label: "Saved" },
  { key: "APPLIED", label: "Applied" },
  { key: "INTERVIEWING", label: "Interviewing" },
  { key: "OFFER", label: "Offer" },
  { key: "REJECTED", label: "Rejected" },
  { key: "WITHDRAWN", label: "Withdrawn" },
];

const emptyForm = {
  jobTitle: "",
  company: "",
  location: "",
  url: "",
  salary: "",
  notes: "",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function updateStatus(id: string, status: ApplicationStatus) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function removeApplication(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
  }

  async function addApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!form.jobTitle || !form.company) return;
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, source: "Manual" }),
    });
    if (res.ok) {
      setForm(emptyForm);
      setShowForm(false);
      load();
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Application status
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Track every application from saved to offer.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
        >
          {showForm ? "Cancel" : "+ Add application"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={addApplication}
          className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-5 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <input
            required
            placeholder="Job title"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            required
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            placeholder="Job URL"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            placeholder="Salary (optional)"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Add
          </button>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-zinc-500">Loading…</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {COLUMNS.map((col) => {
            const items = applications.filter((a) => a.status === col.key);
            return (
              <div key={col.key} className="flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-zinc-500">
                    {col.label}
                  </h2>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  {items.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      {app.url && app.url !== "#" ? (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline"
                        >
                          {app.jobTitle}
                        </a>
                      ) : (
                        <p className="font-medium">{app.jobTitle}</p>
                      )}
                      <p className="text-xs text-zinc-500">{app.company}</p>
                      {app.location && (
                        <p className="text-xs text-zinc-500">
                          {app.location}
                        </p>
                      )}
                      {app.salary && (
                        <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                          {app.salary}
                        </p>
                      )}
                      {app.notes && (
                        <p className="mt-1 text-xs text-zinc-500">
                          {app.notes}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateStatus(
                              app.id,
                              e.target.value as ApplicationStatus,
                            )
                          }
                          className="flex-1 rounded border border-zinc-300 bg-white px-1.5 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.key} value={c.key}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeApplication(app.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-xs text-zinc-400">No applications</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
