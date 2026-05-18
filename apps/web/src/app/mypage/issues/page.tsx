import Link from "next/link";
import { requireSessionToken } from "@/lib/session";
import { listAedSuggestionIssues } from "@/lib/issues";
import { DecisionForm } from "./decision-form";

export default async function IssuesPage() {
  const token = await requireSessionToken();
  const issues = await listAedSuggestionIssues(token);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-12">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI 제안 큐레이션</h1>
        <Link href="/mypage" className="text-sm text-neutral-500 hover:underline">
          ← 마이페이지
        </Link>
      </header>

      {issues.length === 0 ? (
        <p className="text-sm text-neutral-400">검토할 제안이 없습니다. 마이페이지에서 분석을 실행하세요.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {issues.map((issue) => (
            <li key={issue.number} className="rounded-md border p-4">
              <DecisionForm issue={issue} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
