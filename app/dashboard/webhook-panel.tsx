"use client";

import { useEffect, useState } from "react";

interface ReceivedEvent {
  id: string;
  type: string;
  created: string;
  dataId: string;
  receivedAt: string;
}

export function WebhookPanel() {
  const [configured, setConfigured] = useState(false);
  const [events, setEvents] = useState<ReceivedEvent[]>([]);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function poll() {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        const data = (await res.json()) as {
          configured: boolean;
          events: ReceivedEvent[];
        };
        if (!active) return;
        setConfigured(data.configured);
        setEvents(data.events);
      } catch {
        // ignore transient poll errors
      }
    }
    poll();
    const timer = setInterval(poll, 3000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  async function register() {
    setRegistering(true);
    setMessage(null);
    const res = await fetch("/api/webhooks/register", { method: "POST" });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setRegistering(false);
    if (data.error) {
      setMessage(data.error);
      return;
    }
    setConfigured(true);
    setMessage("Webhook registered. Make a test donation to see events here.");
  }

  return (
    <div className="card">
      {configured ? (
        <p className="muted">
          Webhook registered. Events arriving at this app's{" "}
          <code>/api/webhooks</code> appear below (polled every 3s).
        </p>
      ) : (
        <div>
          <p className="muted">
            Register a webhook so this org's events are delivered here. Requires{" "}
            <code>PUBLIC_URL</code> to be a tunnel Givebear can reach.
          </p>
          <button
            type="button"
            className="btn"
            onClick={register}
            disabled={registering}
          >
            {registering ? "Registering…" : "Register webhook"}
          </button>
        </div>
      )}

      {message && (
        <p className="muted" style={{ marginTop: 10 }}>
          {message}
        </p>
      )}

      {events.length > 0 && (
        <table style={{ marginTop: 14 }}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Resource id</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>
                  <code>{e.type}</code>
                </td>
                <td>
                  <code>{e.dataId}</code>
                </td>
                <td>{new Date(e.receivedAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
