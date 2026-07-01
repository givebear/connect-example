import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { givebear } from "@/lib/givebear";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";

/**
 * Register (or re-use) a webhook endpoint pointing at this demo's /api/webhooks
 * receiver, and stash the signing secret so deliveries can be verified. Needs
 * PUBLIC_URL to be a tunnel Givebear can reach.
 */
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }
  if (!config.publicUrl) {
    return NextResponse.json(
      { error: "Set PUBLIC_URL to a tunnel URL so Givebear can reach you." },
      { status: 400 },
    );
  }

  const gb = givebear(session.accessToken);
  const target = new URL("/api/webhooks", config.publicUrl).toString();

  try {
    const existing = await gb.webhooks.list();
    const already = existing.find((e) => e.url === target);
    if (already) {
      // The secret is only returned at creation; recreate to get a fresh one.
      await gb.webhooks.delete(already.id);
    }
    const created = await gb.webhooks.create({
      url: target,
      events: [
        "donation.created",
        "donation.refunded",
        "payout.paid",
        "donor.created",
      ],
    });
    store.setWebhook(created.secret, created.id);
    return NextResponse.json({ ok: true, url: target });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 },
    );
  }
}
