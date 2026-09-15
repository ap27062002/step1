export type SearchResult = {
  id: string;
  title: string;
  link: string;
  snippet: string;
  source: string; // display domain
  isSample: boolean;
};

const SAMPLE_RESULTS: SearchResult[] = [
  {
    id: "sample-1",
    title: "Sample: AI agent startup raises seed round",
    link: "#",
    snippet:
      "Sample result shown because no search API key is configured yet. Add GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX to your .env file to see live results.",
    source: "example.com",
    isSample: true,
  },
  {
    id: "sample-2",
    title: "Sample: emerging no-code AI startups to watch",
    link: "#",
    snippet:
      "Sample result shown because no search API key is configured yet. Add GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX to your .env file to see live results.",
    source: "example.com",
    isSample: true,
  },
  {
    id: "sample-3",
    title: "Sample: stealth AI startup hiring forward deployed engineers",
    link: "#",
    snippet:
      "Sample result shown because no search API key is configured yet. Add GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX to your .env file to see live results.",
    source: "example.com",
    isSample: true,
  },
];

export async function webSearch(
  query: string,
): Promise<{ results: SearchResult[]; usingSampleData: boolean; error?: string }> {
  const apiKey = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;

  if (!apiKey || !cx) {
    return { results: SAMPLE_RESULTS, usingSampleData: true };
  }

  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", query);
  url.searchParams.set("num", "10");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) {
      return {
        results: SAMPLE_RESULTS,
        usingSampleData: true,
        error: `Search API returned ${res.status}`,
      };
    }
    const data = await res.json();
    const results: SearchResult[] = (data.items ?? []).map(
      (item: { title: string; link: string; snippet?: string; displayLink?: string }, i: number) => ({
        id: `${item.link}-${i}`,
        title: item.title,
        link: item.link,
        snippet: item.snippet ?? "",
        source: item.displayLink ?? new URL(item.link).hostname,
        isSample: false,
      }),
    );
    return { results, usingSampleData: false };
  } catch (err) {
    return {
      results: SAMPLE_RESULTS,
      usingSampleData: true,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
