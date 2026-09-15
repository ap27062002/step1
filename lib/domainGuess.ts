// Best-effort guess at a startup's own domain from a search result, since
// Tavily results are often news articles ABOUT a startup rather than the
// startup's own site. Always shown as an editable field, never sent as-is.

const NEWS_AND_AGGREGATOR_DOMAINS = new Set([
  "techcrunch.com",
  "businessinsider.com",
  "forbes.com",
  "bloomberg.com",
  "reuters.com",
  "wsj.com",
  "nytimes.com",
  "theverge.com",
  "venturebeat.com",
  "axios.com",
  "cnbc.com",
  "fortune.com",
  "yahoo.com",
  "news.google.com",
  "medium.com",
  "substack.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "crunchbase.com",
  "wikipedia.org",
]);

function stripWww(hostname: string) {
  return hostname.replace(/^www\./, "");
}

// Finds the first run of 1-3 Title Case words in the title, skipping common
// all-caps acronyms like "AI" or "US", as a naive company-name guess.
function guessNameFromTitle(title: string): string | null {
  const words = title.split(/\s+/);
  const skip = new Set(["AI", "US", "UK", "API", "SaaS", "The", "A", "An"]);
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[^A-Za-z0-9]/g, "");
    if (!word || skip.has(word)) continue;
    if (/^[A-Z][a-z0-9]+$/.test(word)) {
      // Grab up to 2 following Title Case words too (e.g. "Acme Robotics").
      const run = [word];
      for (let j = i + 1; j < Math.min(i + 3, words.length); j++) {
        const next = words[j].replace(/[^A-Za-z0-9]/g, "");
        if (/^[A-Z][a-z0-9]+$/.test(next) && !skip.has(next)) {
          run.push(next);
        } else {
          break;
        }
      }
      return run.join("");
    }
  }
  return null;
}

export function guessDomain(title: string, link: string): string {
  try {
    const hostname = stripWww(new URL(link).hostname);
    if (!NEWS_AND_AGGREGATOR_DOMAINS.has(hostname)) {
      // The link itself isn't a news/aggregator site, so it's probably
      // already the startup's own domain.
      return hostname;
    }
  } catch {
    // Ignore invalid URLs and fall through to the title-based guess.
  }

  const nameGuess = guessNameFromTitle(title);
  return nameGuess ? `${nameGuess.toLowerCase()}.com` : "";
}
