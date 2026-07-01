import Link from "next/link";
import { assertConfigured } from "@/lib/config";
import { getSession } from "@/lib/session";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  const configError = assertConfigured();
  const { error } = await searchParams;

  return (
    <main>
      <h1>Givebear Connect demo</h1>
      <p className="muted">
        A minimal app that connects to a nonprofit's Givebear organization,
        reads its donations, and receives live webhooks - the kind of thing a
        CRM or church tool would build with <code>@givebear/connect</code>.
      </p>

      {error && (
        <p className="card" style={{ borderColor: "#e0a", marginTop: 16 }}>
          Connection error: <code>{error}</code>
        </p>
      )}

      {configError ? (
        <div className="card" style={{ marginTop: 24 }}>
          <strong>Not configured yet.</strong>
          <p className="muted">{configError}</p>
        </div>
      ) : session ? (
        <p style={{ marginTop: 24 }}>
          <Link className="btn" href="/dashboard">
            Go to dashboard →
          </Link>
        </p>
      ) : (
        <p style={{ marginTop: 24 }}>
          <a className="btn accent" href="/api/oauth/start">
            Connect with Givebear
          </a>
        </p>
      )}
    </main>
  );
}
