// Generates LinkedIn search deep-links. These do NOT scrape LinkedIn —
// LinkedIn's Terms of Service prohibit automated scraping and actively
// enforce it. Instead, these build a pre-filled search URL that opens in
// the user's own logged-in browser tab, one click away.

export function linkedInJobSearchUrl(keywords: string, location?: string) {
  const url = new URL("https://www.linkedin.com/jobs/search/");
  url.searchParams.set("keywords", keywords);
  if (location) url.searchParams.set("location", location);
  // Posted in the last week.
  url.searchParams.set("f_TPR", "r604800");
  return url.toString();
}

export function linkedInCompanySearchUrl(keywords: string) {
  const url = new URL("https://www.linkedin.com/search/results/companies/");
  url.searchParams.set("keywords", keywords);
  return url.toString();
}

export function linkedInContentSearchUrl(keywords: string) {
  const url = new URL("https://www.linkedin.com/search/results/content/");
  url.searchParams.set("keywords", keywords);
  // Sort by most recent.
  url.searchParams.set("sortBy", "date_posted");
  return url.toString();
}
