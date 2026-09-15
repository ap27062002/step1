export type Contact = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  seniority: string | null; // "executive" | "senior" | "junior" | null
  confidence: number | null; // 0-100
  isSample: boolean;
};

const SAMPLE_CONTACTS: Contact[] = [
  {
    email: "founder@example.com",
    firstName: "Sample",
    lastName: "Founder",
    position: "Co-Founder & CEO",
    seniority: "executive",
    confidence: 90,
    isSample: true,
  },
  {
    email: "talent@example.com",
    firstName: "Sample",
    lastName: "Recruiter",
    position: "Head of Talent",
    seniority: "senior",
    confidence: 80,
    isSample: true,
  },
];

// Ranks likely-most-useful contacts first: executives and
// founder/CEO/CTO/hiring roles ahead of everyone else.
function contactRank(c: { position: string | null; seniority: string | null }) {
  const position = (c.position ?? "").toLowerCase();
  if (/founder|chief executive|\bceo\b|\bcto\b|\bcpo\b/.test(position)) return 0;
  if (/head of (talent|recruiting|people|hiring)|recruiter|talent acquisition/.test(position))
    return 1;
  if (c.seniority === "executive") return 2;
  if (c.seniority === "senior") return 3;
  return 4;
}

export async function findContacts(
  domain: string,
): Promise<{ contacts: Contact[]; usingSampleData: boolean; error?: string }> {
  const apiKey = process.env.HUNTER_API_KEY;

  if (!apiKey) {
    return { contacts: SAMPLE_CONTACTS, usingSampleData: true };
  }

  const url = new URL("https://api.hunter.io/v2/domain-search");
  url.searchParams.set("domain", domain);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("limit", "10");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) {
      return {
        contacts: SAMPLE_CONTACTS,
        usingSampleData: true,
        error: `Hunter API returned ${res.status}`,
      };
    }
    const data = await res.json();
    const emails: Array<{
      value: string;
      first_name: string | null;
      last_name: string | null;
      position: string | null;
      seniority: string | null;
      confidence: number | null;
    }> = data.data?.emails ?? [];

    const contacts: Contact[] = emails
      .map((e) => ({
        email: e.value,
        firstName: e.first_name,
        lastName: e.last_name,
        position: e.position,
        seniority: e.seniority,
        confidence: e.confidence,
        isSample: false,
      }))
      .sort((a, b) => contactRank(a) - contactRank(b));

    return { contacts, usingSampleData: false };
  } catch (err) {
    return {
      contacts: SAMPLE_CONTACTS,
      usingSampleData: true,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
