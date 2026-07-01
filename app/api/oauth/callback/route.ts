import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { setSession } from "@/lib/session";

/** OAuth callback: verify state, exchange the code for tokens, store a session. */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, url.origin));
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("gb_oauth_state")?.value;
  cookieStore.delete("gb_oauth_state");
  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/?error=bad_state", url.origin));
  }

  const tokenRes = await fetch(
    new URL("/api/auth/oauth2/token", config.baseUrl),
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
      }),
    },
  );

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/?error=token_exchange", url.origin));
  }
  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
  };

  await setSession({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  });

  return NextResponse.redirect(new URL("/dashboard", url.origin));
}
