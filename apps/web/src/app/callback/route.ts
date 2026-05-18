import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { consumeOAuthState, setSessionToken } from "@/lib/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = await consumeOAuthState();

  if (!code || !state || !expectedState || state !== expectedState) {
    return new Response("Invalid OAuth state", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });

  if (!tokenRes.ok) {
    return new Response(`Token exchange failed: ${tokenRes.status}`, { status: 502 });
  }

  const data = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!data.access_token) {
    return new Response(`Token exchange returned no token: ${data.error ?? "unknown"}`, { status: 502 });
  }

  await setSessionToken(data.access_token);
  return NextResponse.redirect(`${url.origin}/mypage`);
}
