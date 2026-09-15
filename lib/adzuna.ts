export type JobResult = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary: string | null;
  postedAt: string | null;
  source: "Adzuna" | "Sample";
};

const SAMPLE_JOBS: JobResult[] = [
  {
    id: "sample-1",
    title: "Forward Deployed Associate Product Manager",
    company: "Sample AI Startup Co.",
    location: "Bengaluru, India (Remote-friendly)",
    description:
      "Sample listing shown because no job API key is configured yet. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to see live results tailored to your target roles.",
    url: "#",
    salary: null,
    postedAt: null,
    source: "Sample",
  },
  {
    id: "sample-2",
    title: "AI APM — Agent Platform",
    company: "Sample Seed-Stage Startup",
    location: "Remote",
    description:
      "Sample listing shown because no job API key is configured yet. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to see live results tailored to your target roles.",
    url: "#",
    salary: null,
    postedAt: null,
    source: "Sample",
  },
  {
    id: "sample-3",
    title: "Product Builder (No-Code / AI Agents)",
    company: "Sample Growth-Stage Startup",
    location: "Gurugram, India",
    description:
      "Sample listing shown because no job API key is configured yet. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to see live results tailored to your target roles.",
    url: "#",
    salary: null,
    postedAt: null,
    source: "Sample",
  },
];

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  if (min && max && min !== max) return `${fmt(min)} - ${fmt(max)}`;
  return fmt(min ?? max ?? 0);
}

export async function searchJobs(params: {
  what: string;
  where?: string;
  page?: number;
  resultsPerPage?: number;
}): Promise<{ jobs: JobResult[]; usingSampleData: boolean; error?: string }> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const country = process.env.ADZUNA_COUNTRY || "in";

  if (!appId || !appKey) {
    return { jobs: SAMPLE_JOBS, usingSampleData: true };
  }

  const page = params.page ?? 1;
  const resultsPerPage = params.resultsPerPage ?? 20;

  const url = new URL(
    `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`,
  );
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("results_per_page", String(resultsPerPage));
  url.searchParams.set("what", params.what);
  if (params.where) url.searchParams.set("where", params.where);
  url.searchParams.set("content-type", "application/json");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) {
      return {
        jobs: SAMPLE_JOBS,
        usingSampleData: true,
        error: `Adzuna API returned ${res.status}`,
      };
    }
    const data = await res.json();
    const jobs: JobResult[] = (data.results ?? []).map((r: {
      id: string;
      title: string;
      company?: { display_name?: string };
      location?: { display_name?: string };
      description?: string;
      redirect_url: string;
      salary_min?: number;
      salary_max?: number;
      created?: string;
    }) => ({
      id: r.id,
      title: r.title,
      company: r.company?.display_name ?? "Unknown company",
      location: r.location?.display_name ?? "Not specified",
      description: r.description ?? "",
      url: r.redirect_url,
      salary: formatSalary(r.salary_min, r.salary_max),
      postedAt: r.created ?? null,
      source: "Adzuna" as const,
    }));
    return { jobs, usingSampleData: false };
  } catch (err) {
    return {
      jobs: SAMPLE_JOBS,
      usingSampleData: true,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
