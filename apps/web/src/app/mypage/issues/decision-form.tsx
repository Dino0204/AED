"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AedIssue } from "@/lib/issues";

type Props = { issue: AedIssue };

const SUGGESTION_LABEL: Record<AedIssue["ai_suggestion"], string> = {
  add: "추가",
  remove: "제거",
  keep: "유지",
};

export function DecisionForm({ issue }: Props) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function submit(accepted: boolean) {
    if (!reason.trim()) {
      setError("이유를 입력하세요.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_number: issue.number,
          issue_url: issue.html_url,
          target_id: issue.target_id,
          target_title: issue.target_title,
          ai_suggestion: issue.ai_suggestion,
          ai_reason: issue.ai_reason,
          accepted,
          reason: reason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `${res.status}`);
      startTransition(() => router.refresh());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-sm">
        <a
          href={issue.html_url}
          target="_blank"
          rel="noreferrer"
          className="font-medium hover:underline"
        >
          #{issue.number} {issue.target_title}
        </a>
        <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs dark:bg-neutral-700">
          AI: {SUGGESTION_LABEL[issue.ai_suggestion]}
        </span>
      </div>
      {issue.ai_reason && (
        <p className="text-xs text-neutral-600 dark:text-neutral-400">{issue.ai_reason}</p>
      )}
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="결정 이유를 입력하세요"
        rows={2}
        disabled={busy}
        className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => submit(true)}
          disabled={busy}
          className="rounded-md bg-black px-3 py-1.5 text-xs text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          수용
        </button>
        <button
          type="button"
          onClick={() => submit(false)}
          disabled={busy}
          className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-50"
        >
          거부
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
