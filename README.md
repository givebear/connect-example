# Givebear Connect example

A minimal "Connect with Givebear" integration. It runs the full OAuth flow,
reads a connected organization's donations with
[`@givebear/connect`](https://www.npmjs.com/package/@givebear/connect), and
shows live webhook events.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/givebear/connect-example)
&nbsp;
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/givebear/connect-example)

> The full flow needs OAuth credentials, so paste your own `GIVEBEAR_CLIENT_ID`
> / `GIVEBEAR_CLIENT_SECRET` after opening. To try a single API call with no
> setup, use the [quickstart](https://givebear.io/docs/developers/connect/quickstart)
> instead.

## What it shows

- **OAuth**: a "Connect with Givebear" button, authorize, token exchange, and a
  session scoped to one org (`app/api/oauth/*`).
- **Read API**: the dashboard lists the org and its donations via the typed
  client (`app/dashboard/page.tsx`).
- **Webhooks**: registers an endpoint with `gb.webhooks.create()`, verifies
  deliveries with `verifyWebhook()`, and streams events into the UI
  (`app/api/webhooks/*`, `app/dashboard/webhook-panel.tsx`).

## Setup

1. **Register an OAuth app** in the Givebear dashboard under
   **Developers -> OAuth apps**:
   - Redirect URI: `http://localhost:4000/api/oauth/callback`
   - Scopes: `donations:read`, `reference:read`, `webhooks:write`,
     `offline_access`

2. **Configure** the app:

   ```bash
   cp .env.example .env
   # fill in GIVEBEAR_CLIENT_ID / GIVEBEAR_CLIENT_SECRET
   ```

3. **Run**:

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:4000 and click **Connect with Givebear**.

## Live webhooks (optional)

Givebear must be able to reach this app to deliver webhooks, so expose it with a
tunnel and set `PUBLIC_URL`:

```bash
cloudflared tunnel --url http://localhost:4000     # or: ngrok http 4000
# set PUBLIC_URL=https://<your-tunnel-host> in .env, restart, then click
# "Register webhook" on the dashboard and make a test donation.
```

## Not production code

The session is a simple signed cookie and the webhook secret / events live in
memory: fine for a demo, but a real integration would use encrypted sessions and
durable storage.

## Docs

- [Quickstart](https://givebear.io/docs/developers/connect/quickstart)
- [Authentication and OAuth](https://givebear.io/docs/developers/connect/authentication)
- [Webhooks](https://givebear.io/docs/developers/connect/webhooks)
- [API reference](https://givebear.io/docs/developers/connect/reference)

## License

MIT
