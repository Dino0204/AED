import { env } from "./env";

export async function callN8n<T = unknown>(webhookUrl: string, body: unknown): Promise<T> {
  if (!webhookUrl) throw new Error("n8n webhook URL not configured");

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-aed-signature": env.N8N_WEBHOOK_SECRET },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`n8n ${res.status}: ${text.slice(0, 300)}`);
  if (!text) throw new Error("n8n returned empty body (workflow may have failed silently)");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`n8n non-JSON response: ${text.slice(0, 300)}`);
  }
}
