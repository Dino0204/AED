import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSessionToken } from "@/lib/session";
import { getJsonFile, putJsonFile } from "@/lib/aed-files";
import { HistorySchema } from "@/lib/schemas";
import { closeIssueWithLabel } from "@/lib/issues";
import { withCors, corsPreflightResponse } from "@/lib/cors";

const BodySchema = z.object({
  issue_number: z.number().int().positive(),
  issue_url: z.string().url().optional(),
  target_id: z.string().min(1),
  target_title: z.string().min(1),
  ai_suggestion: z.enum(["add", "remove", "keep"]),
  ai_reason: z.string().default(""),
  accepted: z.boolean(),
  reason: z.string().default(""),
});

export async function OPTIONS(req: Request) {
  return corsPreflightResponse(req);
}

export async function POST(request: Request) {
  const token = await requireSessionToken(request);
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body", details: parsed.error.format() }, { status: 400 });
  }
  const input = parsed.data;

  const { data: history, sha } = await getJsonFile(token, ".aed/history.json", HistorySchema, {
    version: "1.0",
    entries: [],
  });

  const user_decision = input.accepted ? input.ai_suggestion : "keep";
  const nextNum = history.entries.length + 1;
  const entry = {
    id: `hist-${String(nextNum).padStart(3, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    target_id: input.target_id,
    target_title: input.target_title,
    source_context: ["GitHub 커밋", "직접 입력 메모"],
    ai_suggestion: input.ai_suggestion,
    ai_reason: input.ai_reason,
    user_decision,
    user_reason: input.reason,
    applied: false,
    issue_url: input.issue_url,
  };
  const next = { ...history, entries: [...history.entries, entry] };

  await putJsonFile(
    token,
    ".aed/history.json",
    next,
    `aed: ${input.accepted ? "accept" : "reject"} ${input.ai_suggestion} ${input.target_id}`,
    sha,
  );
  await closeIssueWithLabel(token, input.issue_number, input.accepted);

  return withCors(NextResponse.json({ ok: true, entry }), request);
}
