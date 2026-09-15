import { dbAvailable } from "@/lib/prisma";
import ApplicationsBoard from "./ApplicationsBoard";

export default function ApplicationsPage() {
  if (!dbAvailable) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">
          Application status
        </h1>
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <p className="font-medium">Application tracker isn&apos;t set up yet.</p>
          <p className="mt-2">
            This deployment doesn&apos;t have a database configured. Set{" "}
            <code>TURSO_DATABASE_URL</code> and <code>TURSO_AUTH_TOKEN</code>{" "}
            as environment variables (see the README&apos;s &quot;Deploying to
            Vercel&quot; section) and redeploy to enable it.
          </p>
        </div>
      </div>
    );
  }

  return <ApplicationsBoard />;
}
