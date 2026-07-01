import type { Donation, Organization } from "@givebear/connect";
import Link from "next/link";
import { redirect } from "next/navigation";
import { givebear } from "@/lib/givebear";
import { getSession } from "@/lib/session";
import { WebhookPanel } from "./webhook-panel";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/");

  const gb = givebear(session.accessToken);

  let org: Organization | null = null;
  let donations: Donation[] = [];
  let error: string | null = null;
  try {
    org = await gb.organization.get();
    const page = await gb.donations.list({ limit: 20 });
    donations = page.data;
  } catch (err) {
    error = err instanceof Error ? err.message : "Request failed";
  }

  if (error) {
    return (
      <main>
        <h1>Dashboard</h1>
        <p className="card" style={{ borderColor: "#e0a" }}>
          Could not load data: <code>{error}</code>
          <br />
          <Link href="/api/oauth/start">Reconnect →</Link>
        </p>
      </main>
    );
  }

  return (
    <main>
      <p style={{ marginBottom: 4 }}>
        <Link className="muted" href="/">
          ← Home
        </Link>
      </p>
      <h1>{org?.name ?? "Organization"}</h1>
      <p className="muted">
        Connected via OAuth. Reading this org's data with a <code>gba_</code>{" "}
        access token.
      </p>

      <section style={{ marginTop: 28 }}>
        <h2>Recent donations</h2>
        {donations.length === 0 ? (
          <p className="muted">No donations yet.</p>
        ) : (
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table>
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Fund</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>{d.donor_name ?? d.donor_email ?? "Anonymous"}</td>
                    <td>{formatCents(d.amount_cents)}</td>
                    <td>{d.fund_name ?? "-"}</td>
                    <td>{new Date(d.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>Live webhooks</h2>
        <WebhookPanel />
      </section>
    </main>
  );
}
