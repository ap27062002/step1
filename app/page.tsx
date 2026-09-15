import { persona } from "@/lib/persona";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-10 border-t border-zinc-200 dark:border-zinc-800 first:border-t-0 first:pt-0">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SkillPills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <div className="mb-4">
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {persona.currentRole.title} @ {persona.currentRole.company}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {persona.name}
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {persona.title}
        </p>
        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          {persona.summary}
        </p>
        <a
          href={`mailto:${persona.contact.email}`}
          className="mt-5 inline-block rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
        >
          {persona.contact.email}
        </a>
      </div>

      <Section title="Aspirations">
        <ul className="grid gap-3 sm:grid-cols-2">
          {persona.aspirations.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Target roles">
        <SkillPills items={persona.targetRoles} />
      </Section>

      <Section title="Education">
        <div className="space-y-3">
          {persona.education.map((edu) => (
            <div key={edu.institution}>
              <p className="font-medium">{edu.degree}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {edu.institution} · {edu.year}
              </p>
            </div>
          ))}
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {persona.experienceYears} year of corporate experience as a
            product builder.
          </p>
        </div>
      </Section>

      <Section title="Skills">
        <div className="space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-500">
              Technical
            </h3>
            <SkillPills items={persona.skills.technical} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-500">
              Product &amp; Soft Skills
            </h3>
            <SkillPills items={persona.skills.product} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-500">Tools</h3>
            <SkillPills items={persona.skills.tools} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-500">
              Languages
            </h3>
            <SkillPills items={persona.skills.languages} />
          </div>
        </div>
      </Section>

      <Section title="Projects">
        <div className="grid gap-4 sm:grid-cols-2">
          {persona.projects.map((project) => (
            <div
              key={project.name}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="font-semibold">{project.name}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
