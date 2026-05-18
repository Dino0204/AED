import { NextResponse } from "next/server";
import { requireSessionToken } from "@/lib/session";
import { callN8n } from "@/lib/n8n";
import { env } from "@/lib/env";

export async function POST() {
  const token = await requireSessionToken();
  if (!env.N8N_WEBHOOK_BOOTSTRAP) {
    return NextResponse.json({ error: "N8N_WEBHOOK_BOOTSTRAP not configured" }, { status: 503 });
  }
  try {
    const result = await callN8n(env.N8N_WEBHOOK_BOOTSTRAP, {
      owner: env.PORTFOLIO_OWNER,
      repo: env.PORTFOLIO_REPO,
      token,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
