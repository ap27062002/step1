// Apoorva Ankit's portfolio / persona data.
// Edit this file to update portfolio content shown on the site.

export const persona = {
  name: "Apoorva Ankit",
  title: "Associate Product Manager — AI & No-Code Builder",
  currentRole: {
    title: "Associate Product Manager (APM)",
    company: "UnifyApps",
  },
  tagline:
    "Aspiring builder riding the AI wave — turning ambitious ideas into shipped, revenue-generating products fast.",
  summary:
    "Apoorva is a hard-working, fast-learning product builder who thrives on ownership. Currently an APM at UnifyApps, he is looking for high-growth, high-ownership roles — ideally at a startup, with equity on the table — where he can go all-in on interesting problems in the AI space and eventually build something of his own.",
  aspirations: [
    "Stay immersed in the AI wave and the AI-native product/tooling industry.",
    "Join or build a startup with high ownership — equity is a strong plus.",
    "Compound fast learning into outsized impact; give 100% for roles that are genuinely interesting.",
    "Eventually found and build his own company/product.",
  ],
  education: [
    {
      degree: "B.Tech, Metallurgical Engineering",
      institution: "Indian Institute of Technology (IIT) BHU, Varanasi",
      year: "2025",
    },
  ],
  experienceYears: 1,
  targetRoles: [
    "Product Builder",
    "Forward Deployed Associate Product Manager",
    "AI APM",
    "Associate Product Manager",
  ],
  skills: {
    technical: [
      "No-code app development",
      "Workflow orchestration",
      "AI agent configuration",
      "Agent eval setup",
      "App development",
      "APIs & integrations",
      "Databases",
      "CI/CD pipelines",
      "Auth & identity",
      "Product design sense",
    ],
    product: [
      "Product management",
      "Product roadmap development",
      "High-stakes client handling",
      "Team handling",
      "Stakeholder management",
      "Project management",
    ],
    tools: [
      "n8n",
      "Zapier",
      "Lovable",
      "Claude Code",
      "Unify Builder",
      "No-code builders (general)",
    ],
    languages: ["Hindi", "English"],
  },
  projects: [
    {
      name: "End-to-End CLM (Contract Lifecycle Management) Platform",
      description:
        "Built an E2E CLM app from scratch for a client — ticketing, versioning, storage, and allocation — successfully replacing Jira and SharePoint in the client's contract workflow.",
      tags: ["No-code", "Workflow orchestration", "Enterprise"],
    },
    {
      name: "Real-Time Document Review Plugin (Word)",
      description:
        "Built a plug-and-play Word plugin, similar to Claude, for real-time document analysis and edits — flagging issues and running ad-hoc analysis against a company's own rulebook.",
      tags: ["AI agents", "Document intelligence", "Plugin"],
    },
    {
      name: "Agentic Rulebook & Template Builder",
      description:
        "Built a holistic app supporting agentic creation of rulebooks, templates, and related legal artifacts inside the product — fully replacing 'Claude for Legal' style workflows for the client.",
      tags: ["AI agents", "LegalTech", "No-code"],
    },
    {
      name: "Native Mobile Apps (x3)",
      description:
        "Built and shipped three native mobile apps that are live and running in production.",
      tags: ["Mobile", "Shipped product"],
    },
    {
      name: "Agentic Candidate Profile Builder",
      description:
        "Built a profile-builder agent for one of the largest nursing companies in the US, covering resume parsing and the candidate application process, plus a fully agentic skills-checklist process.",
      tags: ["AI agents", "Recruiting tech", "Resume parsing"],
    },
  ],
  contact: {
    email: "apoorvankit.2001@gmail.com",
  },
  // Curated queries for the startup/funding discovery feed on the Jobs page.
  discoveryQueries: [
    "AI agent startup raises seed funding 2026",
    "AI native startup Series A funding announcement",
    "no-code AI automation startup funding",
    "new AI startup stealth launch hiring product manager",
    "fastest growing AI startups to watch 2026",
    "AI agent platform startup hiring forward deployed",
  ],
};

export type Persona = typeof persona;
