import { useEffect, useState } from "react";
import type { AedIssue } from "../../lib/types";
import { getIssues } from "../../lib/api";
import { DecisionCard } from "../components/DecisionCard";

export function SuggestionsView() {
  const [issues, setIssues] = useState<AedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setIssues(await getIssues());
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function removeIssue(number: number) {
    setIssues((prev) => prev.filter((i) => i.number !== number));
  }

  if (loading) return <p style={{ padding: 16, color: "#718096" }}>불러오는 중...</p>;
  if (error) return (
    <div style={{ padding: 16 }}>
      <p style={{ color: "#c53030", marginBottom: 10 }}>{error}</p>
      <button onClick={load} style={{ padding: "6px 14px", borderRadius: 4, border: "1px solid #e2e8f0", cursor: "pointer" }}>다시 시도</button>
    </div>
  );
  if (issues.length === 0) return (
    <div style={{ padding: 16, textAlign: "center", color: "#718096" }}>
      <p style={{ marginBottom: 8 }}>검토할 AI 제안이 없습니다.</p>
      <button onClick={load} style={{ padding: "6px 14px", borderRadius: 4, border: "1px solid #e2e8f0", cursor: "pointer", fontSize: 12 }}>새로고침</button>
    </div>
  );

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: "#718096" }}>{issues.length}개 제안</span>
        <button onClick={load} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, border: "1px solid #e2e8f0", cursor: "pointer" }}>새로고침</button>
      </div>
      {issues.map((issue) => (
        <DecisionCard key={issue.number} issue={issue} onDone={() => removeIssue(issue.number)} />
      ))}
    </div>
  );
}
