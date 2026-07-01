import { verifyWebhook, WebhookVerificationError } from "@givebear/connect";
import type { NextRequest } from "next/server";
import { store } from "@/lib/store";

/** Receives Givebear webhooks, verifies the signature, and records the event. */
export async function POST(req: NextRequest) {
  const secret = store.getSecret();
  if (!secret) {
    return new Response("No webhook configured", { status: 503 });
  }

  const body = await req.text();
  try {
    const event = await verifyWebhook({
      secret,
      signature: req.headers.get("x-givebear-signature") ?? "",
      body,
    });
    store.addEvent(event);
    return new Response("ok");
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return new Response("Invalid signature", { status: 400 });
    }
    throw err;
  }
}
