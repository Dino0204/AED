import { useEffect, useState } from "react";
import { addMemo } from "../../lib/api";
import type { PageContext } from "../../lib/types";

function buildMemoPrefix(ctx: PageContext | null): string {
  if (!ctx) return "";
  const sourceLabel = ctx.sourceType.toUpperCase();
  return `[${sourceLabel}] ${ctx.title}\n`;
}

export function MemoView({ pageContext }: { pageContext: PageContext | null }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pageContext) setContent(buildMemoPrefix(pageContext));
  }, [pageContext]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await addMemo(content.trim());
      setSuccess(true);
      setContent(buildMemoPrefix(pageContext));
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메모를 입력하세요..."
          rows={6}
          style={{
            width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #cbd5e0",
            fontSize: 13, resize: "vertical", marginBottom: 8, fontFamily: "inherit", lineHeight: 1.5,
          }}
        />
        {error && <p style={{ color: "#c53030", fontSize: 12, marginBottom: 6 }}>{error}</p>}
        {success && <p style={{ color: "#2f855a", fontSize: 12, marginBottom: 6 }}>저장됐습니다.</p>}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          style={{
            width: "100%", padding: "8px 0", borderRadius: 6, border: "none",
            background: "#2b6cb0", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13,
          }}
        >
          {loading ? "저장 중..." : "메모 저장"}
        </button>
      </form>
    </div>
  );
}
