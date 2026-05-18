import Link from "next/link";
import { requireSessionToken } from "@/lib/session";
import { getCurrentUser } from "@/lib/github";
import { getJsonFile } from "@/lib/aed-files";
import { MemosSchema, PortfolioSchema } from "@/lib/schemas";
import { env } from "@/lib/env";
import { MemoForm } from "./memo-form";
import { BootstrapButton } from "./bootstrap-button";
import { AnalyzeButton } from "./analyze-button";

export default async function MyPage() {
  const token = await requireSessionToken();
  const [user, memosResult, portfolioResult] = await Promise.all([
    getCurrentUser(token),
    getJsonFile(token, ".aed/memos.json", MemosSchema, { memos: [] }),
    getJsonFile(token, ".aed/portfolio.json", PortfolioSchema, { version: "1.0", items: [] }),
  ]);
  const memos = [...memosResult.data.memos].reverse();
  const portfolio = portfolioResult.data;
  const hasManifest = portfolioResult.sha !== null;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-12">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">환영합니다, {user.name ?? user.login}</h1>
        <nav className="flex items-center gap-4 text-sm text-neutral-500">
          <Link href="/mypage/issues" className="hover:underline">제안</Link>
          <Link href="/mypage/history" className="hover:underline">히스토리</Link>
          <Link href="/auth/logout" className="hover:underline">로그아웃</Link>
        </nav>
      </header>

      <section className="rounded-md border p-6">
        <h2 className="mb-3 text-lg font-medium">연결된 소스</h2>
        <ul className="text-sm text-neutral-700 dark:text-neutral-300">
          <li>✓ GitHub ({env.PORTFOLIO_OWNER}/{env.PORTFOLIO_REPO})</li>
          <li className="text-neutral-400">○ Notion (미연결)</li>
        </ul>
      </section>

      <section className="rounded-md border p-6">
        <h2 className="mb-3 text-lg font-medium">포트폴리오 manifest</h2>
        {hasManifest ? (
          <div className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            ✓ {portfolio.items.length}개 항목 등록됨
            {portfolio.generated_at && (
              <span className="ml-2 text-xs text-neutral-400">({portfolio.generated_at.slice(0, 10)})</span>
            )}
          </div>
        ) : (
          <p className="mb-3 text-sm text-neutral-400">아직 생성되지 않았습니다. 분석을 실행하려면 먼저 manifest를 만들어야 합니다.</p>
        )}
        <BootstrapButton hasManifest={hasManifest} />
      </section>

      <section className="rounded-md border p-6">
        <h2 className="mb-3 text-lg font-medium">AI 분석</h2>
        <p className="mb-3 text-sm text-neutral-500">최근 커밋·메모·과거 큐레이션을 바탕으로 add/remove/keep 제안을 GitHub Issue로 생성합니다.</p>
        <AnalyzeButton disabled={!hasManifest} />
      </section>

      <section className="rounded-md border p-6">
        <h2 className="mb-3 text-lg font-medium">직접 입력 메모</h2>
        <MemoForm />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">메모 ({memos.length})</h2>
        {memos.length === 0 ? (
          <p className="text-sm text-neutral-400">아직 메모가 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {memos.map((m) => (
              <li key={m.id} className="rounded-md border p-3 text-sm">
                <div className="mb-1 text-xs text-neutral-400">{m.date}</div>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
