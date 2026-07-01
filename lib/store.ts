import type { WebhookPayload } from "@givebear/connect";

/**
 * In-memory demo store for received webhook events and the endpoint's signing
 * secret. Module-level state is fine for a single-process demo; a real app
 * would persist these.
 */

export interface ReceivedEvent {
  id: string;
  type: string;
  created: string;
  dataId: string;
  receivedAt: string;
}

const events: ReceivedEvent[] = [];
let webhookSecret: string | null = null;
let webhookEndpointId: string | null = null;

export const store = {
  setWebhook(secret: string, endpointId: string) {
    webhookSecret = secret;
    webhookEndpointId = endpointId;
  },
  getSecret() {
    return webhookSecret;
  },
  getEndpointId() {
    return webhookEndpointId;
  },
  addEvent(payload: WebhookPayload) {
    events.unshift({
      id: payload.id,
      type: payload.type,
      created: payload.created,
      dataId: payload.data.id,
      receivedAt: new Date().toISOString(),
    });
    if (events.length > 50) events.length = 50;
  },
  recent() {
    return events.slice(0, 25);
  },
};
