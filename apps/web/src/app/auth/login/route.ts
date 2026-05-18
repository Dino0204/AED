import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { setOAuthState } from "@/lib/session";

export async function GET(req: Request) {
  const state = crypto.randomUUID();
  await setOAuthState(state);

  const origin = new URL(req.url).origin;
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${origin}/callback`,
    scope: "repo",
    state,
  });

  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
