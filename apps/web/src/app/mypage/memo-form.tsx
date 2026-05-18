"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function MemoForm() {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function submit() {
    setError(null);
    const res = await fetch("/api/memos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      setError(`저장 실패: ${res.status}`);
      return;
    }
    setContent("");
    startTransition(() => router.refresh());
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="머릿속에만 있는 것을 적어두세요"
        className="min-h-24 rounded-md border bg-transparent p-3 text-sm focus:border-neutral-500 focus:outline-none"
        required
      />
      <div className="flex items-center justify-between">
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={pending || !content.trim()}
          className="ml-auto rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "저장 중..." : "메모 추가"}
        </button>
      </div>
    </form>
  );
}
