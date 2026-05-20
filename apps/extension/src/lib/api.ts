import { getSettings } from "./storage";
import type { AedIssue, Memo } from "./types";

async function fetchAed<T>(path: string, init?: RequestInit): Promise<T> {
  const { aedUrl, ghToken } = await getSettings();
  if (!aedUrl || !ghToken) throw new Error("AED 설정이 없습니다. 설정 탭에서 URL과 토큰을 입력해주세요.");

  const res = await fetch(`${aedUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ghToken}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API 오류 ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function getIssues(): Promise<AedIssue[]> {
  const data = await fetchAed<{ issues: AedIssue[] }>("/api/issues");
  return data.issues;
}

export async function getMemos(): Promise<Memo[]> {
  const data = await fetchAed<{ memos: Memo[] }>("/api/memos");
  return data.memos;
}

export async function addMemo(content: string): Promise<Memo> {
  return fetchAed<Memo>("/api/memos", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function submitDecision(body: {
  issue_number: number;
  issue_url: string;
  target_id: string;
  target_title: string;
  ai_suggestion: "add" | "remove" | "keep";
  ai_reason: string;
  accepted: boolean;
  reason: string;
}): Promise<void> {
  await fetchAed("/api/decisions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function testConnection(): Promise<boolean> {
  try {
    await getMemos();
    return true;
  } catch {
    return false;
  }
}
