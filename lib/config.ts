/** Demo configuration, read from the environment. See .env.example. */
export const config = {
  /** Givebear origin, e.g. https://givebear.io or http://localhost:3000. */
  baseUrl: process.env.GIVEBEAR_BASE_URL ?? "https://givebear.io",
  clientId: process.env.GIVEBEAR_CLIENT_ID ?? "",
  clientSecret: process.env.GIVEBEAR_CLIENT_SECRET ?? "",
  /** Must exactly match a redirect URI registered on the app. */
  redirectUri:
    process.env.OAUTH_REDIRECT_URI ??
    "http://localhost:4000/api/oauth/callback",
  /** Secret used to sign the demo's session cookie. */
  sessionSecret: process.env.SESSION_SECRET ?? "dev-insecure-session-secret",
  /**
   * Public URL of THIS demo (e.g. an ngrok/cloudflared tunnel) so Givebear can
   * reach the webhook receiver. Leave unset to skip webhook registration.
   */
  publicUrl: process.env.PUBLIC_URL ?? "",
  /** Scopes the demo requests. */
  scopes: [
    "donations:read",
    "reference:read",
    "webhooks:write",
    "offline_access",
  ],
};

export function assertConfigured(): string | null {
  if (!config.clientId || !config.clientSecret) {
    return "Set GIVEBEAR_CLIENT_ID and GIVEBEAR_CLIENT_SECRET in .env (register an app under Dashboard -> Developers -> OAuth apps).";
  }
  return null;
}
