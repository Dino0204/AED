"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = { disabled?: boolean };

export function AnalyzeButton({ disabled }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function run() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `${res.status}`);
      const count = data.count ?? data.issues?.length ?? 0;
      setResult(count > 0 ? `완료: Issue ${count}개 생성됨` : "완료: 새로운 제안 없음");
      startTransition(() => router.refresh());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={run}
        disabled={busy || pending || disabled}
        className="self-start rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {busy ? "분석 중... (30~60초)" : "분석 실행"}
      </button>
      {disabled && <p className="text-xs text-neutral-400">manifest를 먼저 생성하세요.</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && <p className="text-xs text-green-600">{result}</p>}
    </div>
  );
}
