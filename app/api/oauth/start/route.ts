import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { assertConfigured, config } from "@/lib/config";

/** Kick off the OAuth flow: redirect the admin to Givebear's authorize page. */
export async function GET() {
  const notConfigured = assertConfigured();
  if (notConfigured) {
    return NextResponse.json({ error: notConfigured }, { status: 500 });
  }

  const state = randomBytes(16).toString("hex");
  (await cookies()).set("gb_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const authorize = new URL("/api/auth/oauth2/authorize", config.baseUrl);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", config.clientId);
  authorize.searchParams.set("redirect_uri", config.redirectUri);
  authorize.searchParams.set("scope", config.scopes.join(" "));
  authorize.searchParams.set("state", state);

  return NextResponse.redirect(authorize.toString());
}
