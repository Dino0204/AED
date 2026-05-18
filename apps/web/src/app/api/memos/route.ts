import { NextResponse } from "next/server";
import { requireSessionToken } from "@/lib/session";
import { getJsonFile, putJsonFile } from "@/lib/aed-files";
import { MemosSchema } from "@/lib/schemas";

const PATH = ".aed/memos.json";
const EMPTY = { memos: [] };

export async function GET() {
  const token = await requireSessionToken();
  const { data } = await getJsonFile(token, PATH, MemosSchema, EMPTY);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const token = await requireSessionToken();
  const body = (await req.json()) as { content?: string };
  const content = body.content?.trim();
  if (!content) return NextResponse.json({ error: "content required" }, { status: 400 });

  const { data, sha } = await getJsonFile(token, PATH, MemosSchema, EMPTY);
  const memo = {
    id: `memo-${Date.now().toString(36)}`,
    date: new Date().toISOString().slice(0, 10),
    content,
  };
  const next = { memos: [...data.memos, memo] };
  await putJsonFile(token, PATH, next, `aed: add memo ${memo.id}`, sha);
  return NextResponse.json(memo, { status: 201 });
}
