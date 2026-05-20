import { useState } from "react";
import type { AedIssue } from "../../lib/types";
import { submitDecision } from "../../lib/api";

const SUGGESTION_LABEL: Record<string, string> = {
  add: "추가",
  remove: "제거",
  keep: "유지",
};

const SUGGESTION_COLOR: Record<string, string> = {
  add: "#2f855a",
  remove: "#c53030",
  keep: "#2b6cb0",
};

interface Props {
  issue: AedIssue;
  onDone: () => void;
}

export function DecisionCard({ issue, onDone }: Props) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(accepted: boolean) {
    setLoading(true);
    setError(null);
    try {
      await submitDecision({
        issue_number: issue.number,
        issue_url: issue.html_url,
        target_id: issue.target_id,
        target_title: issue.target_title,
        ai_suggestion: issue.ai_suggestion,
        ai_reason: issue.ai_reason,
        accepted,
        reason,
      });
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류 발생");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{
          padding: "1px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
          color: "#fff", background: SUGGESTION_COLOR[issue.ai_suggestion],
        }}>
          {SUGGESTION_LABEL[issue.ai_suggestion]}
        </span>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{issue.target_title}</span>
      </div>
      {issue.ai_reason && (
        <p style={{ fontSize: 12, color: "#4a5568", marginBottom: 8, lineHeight: 1.5 }}>
          {issue.ai_reason}
        </p>
      )}
      <textarea
        placeholder="결정 이유 (선택)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        style={{
          width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid #cbd5e0",
          fontSize: 12, resize: "none", marginBottom: 8, fontFamily: "inherit",
        }}
      />
      {error && <p style={{ color: "#c53030", fontSize: 12, marginBottom: 6 }}>{error}</p>}
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => decide(true)}
          disabled={loading}
          style={{
            flex: 1, padding: "6px 0", borderRadius: 4, border: "none",
            background: "#2f855a", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          수용
        </button>
        <button
          onClick={() => decide(false)}
          disabled={loading}
          style={{
            flex: 1, padding: "6px 0", borderRadius: 4, border: "none",
            background: "#e53e3e", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          거부
        </button>
      </div>
    </div>
  );
}
