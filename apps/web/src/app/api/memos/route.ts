import { NextResponse } from "next/server";
import { requireSessionToken } from "@/lib/session";
import { getJsonFile, putJsonFile } from "@/lib/aed-files";
import { MemosSchema } from "@/lib/schemas";
import { withCors, corsPreflightResponse } from "@/lib/cors";

const PATH = ".aed/memos.json";
const EMPTY = { memos: [] };

export async function OPTIONS(req: Request) {
  return corsPreflightResponse(req);
}

export async function GET(req: Request) {
  const token = await requireSessionToken(req);
  const { data } = await getJsonFile(token, PATH, MemosSchema, EMPTY);
  return withCors(NextResponse.json(data), req);
}

export async function POST(req: Request) {
  const token = await requireSessionToken(req);
  const body = (await req.json()) as { content?: string };
  const content = body.content?.trim();
  if (!content) return withCors(NextResponse.json({ error: "content required" }, { status: 400 }), req);

  const { data, sha } = await getJsonFile(token, PATH, MemosSchema, EMPTY);
  const memo = {
    id: `memo-${Date.now().toString(36)}`,
    date: new Date().toISOString().slice(0, 10),
    content,
  };
  const next = { memos: [...data.memos, memo] };
  await putJsonFile(token, PATH, next, `aed: add memo ${memo.id}`, sha);
  return withCors(NextResponse.json(memo, { status: 201 }), req);
}
