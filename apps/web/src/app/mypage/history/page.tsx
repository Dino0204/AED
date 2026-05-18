import Link from "next/link";
import { requireSessionToken } from "@/lib/session";
import { getJsonFile } from "@/lib/aed-files";
import { HistorySchema } from "@/lib/schemas";

const DECISION_LABEL: Record<"add" | "remove" | "keep", string> = {
  add: "추가",
  remove: "제거",
  keep: "유지",
};

export default async function HistoryPage() {
  const token = await requireSessionToken();
  const { data } = await getJsonFile(token, ".aed/history.json", HistorySchema, {
    version: "1.0",
    entries: [],
  });
  const entries = [...data.entries].reverse();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-12">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">큐레이션 히스토리</h1>
        <Link href="/mypage" className="text-sm text-neutral-500 hover:underline">
          ← 마이페이지
        </Link>
      </header>

      {entries.length === 0 ? (
        <p className="text-sm text-neutral-400">아직 결정 기록이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((e) => {
            const accepted = e.user_decision === e.ai_suggestion;
            return (
              <li key={e.id} className="rounded-md border p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span>{e.date}</span>
                  <span>·</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{e.target_title}</span>
                  <span className="text-neutral-400">({e.target_id})</span>
                  <span className="ml-auto rounded bg-neutral-200 px-2 py-0.5 dark:bg-neutral-700">
                    AI: {DECISION_LABEL[e.ai_suggestion]} → 사용자: {accepted ? "수용" : "거부"}
                  </span>
                </div>
                {e.ai_reason && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">AI: {e.ai_reason}</p>
                )}
                {e.user_reason && <p className="mt-1 text-sm">나: {e.user_reason}</p>}
                {e.issue_url && (
                  <a
                    href={e.issue_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-neutral-400 hover:underline"
                  >
                    원본 Issue →
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
