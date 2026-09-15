"use client";

import { useState } from "react";
import type { SearchResult } from "@/lib/tavily";
import type { Contact } from "@/lib/hunter";
import { guessDomain } from "@/lib/domainGuess";
import { buildOutreachMailto } from "@/lib/emailTemplate";

function contactLabel(contact: Contact) {
  const name = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
  return name || contact.email;
}

export default function ReachOutPanel({ result }: { result: SearchResult }) {
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState(() =>
    guessDomain(result.title, result.link),
  );
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function findContacts() {
    if (!domain.trim()) {
      setError("Enter the startup's domain first (e.g. acmeai.com).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/contacts?domain=${encodeURIComponent(domain.trim())}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not look up contacts.");
        setContacts([]);
      } else {
        setContacts(data.contacts ?? []);
        setUsingSampleData(Boolean(data.usingSampleData));
      }
    } catch {
      setError("Could not look up contacts. Please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-900">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        {open ? "Hide reach-out" : "Reach out ↗"}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Startup domain, e.g. acmeai.com"
              className="flex-1 min-w-[180px] rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              onClick={findContacts}
              disabled={loading}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
            >
              {loading ? "Searching…" : "Find contacts"}
            </button>
          </div>

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          {usingSampleData && (
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Showing sample contacts. Add <code>HUNTER_API_KEY</code> to your{" "}
              <code>.env</code> file for real results.
            </p>
          )}

          {searched && !loading && contacts.length === 0 && !error && (
            <p className="text-xs text-zinc-500">
              No public contacts found for this domain.
            </p>
          )}

          {contacts.length > 0 && (
            <ul className="space-y-2">
              {contacts.map((contact) => (
                <li
                  key={contact.email}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900"
                >
                  <div>
                    <p className="font-medium">{contactLabel(contact)}</p>
                    <p className="text-xs text-zinc-500">
                      {contact.position ?? "Unknown role"} · {contact.email}
                      {contact.confidence != null && ` · ${contact.confidence}% confidence`}
                    </p>
                  </div>
                  <a
                    href={buildOutreachMailto({
                      toEmail: contact.email,
                      contactFirstName: contact.firstName,
                      companyLabel: domain,
                      context: result.title,
                    })}
                    className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500"
                  >
                    Email ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
