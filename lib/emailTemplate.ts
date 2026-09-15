import { persona } from "./persona";

export function buildOutreachMailto(params: {
  toEmail: string;
  contactFirstName?: string | null;
  companyLabel: string; // domain or startup name, for the subject/body
  context?: string; // e.g. the article title that surfaced this company
}): string {
  const greetingName = params.contactFirstName || "there";
  const firstNameOnly = persona.name.split(" ")[0];

  const subject = `${persona.name} — interested in ${params.companyLabel}`;

  const bodyLines = [
    `Hi ${greetingName},`,
    "",
    `I'm ${persona.name}, currently ${persona.currentRole.title} at ${persona.currentRole.company}.${
      params.context ? ` I came across ${params.companyLabel} (${params.context}) and it caught my attention.` : ` ${params.companyLabel} caught my attention.`
    }`,
    "",
    persona.summary,
    "",
    `I'd love to learn more about what you're building and see if there's a fit for a ${persona.targetRoles[0]}-type role. Happy to share more about my background — a few projects: ${persona.projects
      .slice(0, 2)
      .map((p) => p.name)
      .join("; ")}.`,
    "",
    "Would you be open to a quick chat?",
    "",
    "Best,",
    firstNameOnly,
    persona.contact.email,
  ];

  const body = bodyLines.join("\n");

  // Built by hand rather than via URLSearchParams: mailto: query values must
  // be percent-encoded per RFC 6068 (spaces as %20), but URLSearchParams
  // uses application/x-www-form-urlencoded (spaces as "+"), which most mail
  // clients render as literal "+" characters instead of spaces.
  return `mailto:${params.toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
