"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = { hasManifest: boolean };

export function BootstrapButton({ hasManifest }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function run() {
    if (hasManifest && !confirm("이미 manifest가 있습니다. 다시 생성하면 덮어씁니다. 진행할까요?")) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/bootstrap", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `${res.status}`);
      setResult(`완료: ${data.itemCount}개 항목 생성됨`);
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
        disabled={busy || pending}
        className="self-start rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {busy ? "분석 중... (30~60초)" : hasManifest ? "manifest 재생성" : "포트폴리오 분석 초기화"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && <p className="text-xs text-green-600">{result}</p>}
    </div>
  );
}
