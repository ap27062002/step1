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
      "Sample result shown because no search API key is configured yet. Add TAVILY_API_KEY to your .env file to see live results.",
    source: "example.com",
    isSample: true,
  },
  {
    id: "sample-2",
    title: "Sample: emerging no-code AI startups to watch",
    link: "#",
    snippet:
      "Sample result shown because no search API key is configured yet. Add TAVILY_API_KEY to your .env file to see live results.",
    source: "example.com",
    isSample: true,
  },
  {
    id: "sample-3",
    title: "Sample: stealth AI startup hiring forward deployed engineers",
    link: "#",
    snippet:
      "Sample result shown because no search API key is configured yet. Add TAVILY_API_KEY to your .env file to see live results.",
    source: "example.com",
    isSample: true,
  },
];

export async function webSearch(
  query: string,
): Promise<{ results: SearchResult[]; usingSampleData: boolean; error?: string }> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return { results: SAMPLE_RESULTS, usingSampleData: true };
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: 10,
      }),
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      return {
        results: SAMPLE_RESULTS,
        usingSampleData: true,
        error: `Tavily API returned ${res.status}`,
      };
    }
    const data = await res.json();
    const results: SearchResult[] = (data.results ?? []).map(
      (item: { title: string; url: string; content?: string }, i: number) => ({
        id: `${item.url}-${i}`,
        title: item.title,
        link: item.url,
        snippet: item.content ?? "",
        source: (() => {
          try {
            return new URL(item.url).hostname;
          } catch {
            return item.url;
          }
        })(),
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
