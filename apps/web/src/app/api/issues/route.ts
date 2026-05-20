import { NextResponse } from "next/server";
import { requireSessionToken } from "@/lib/session";
import { listAedSuggestionIssues } from "@/lib/issues";
import { withCors, corsPreflightResponse } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return corsPreflightResponse(req);
}

export async function GET(req: Request) {
  const token = await requireSessionToken(req);
  const issues = await listAedSuggestionIssues(token);
  return withCors(NextResponse.json({ issues }), req);
}
