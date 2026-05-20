import { useEffect, useState } from "react";
import { getSettings, setSettings } from "../../lib/storage";
import { testConnection } from "../../lib/api";

type Status = "idle" | "testing" | "ok" | "fail";

export function SettingsView() {
  const [aedUrl, setAedUrl] = useState("");
  const [ghToken, setGhToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      setAedUrl(s.aedUrl);
      setGhToken(s.ghToken ?? "");
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await setSettings({ aedUrl: aedUrl.replace(/\/$/, ""), ghToken: ghToken || null });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleTest() {
    setStatus("testing");
    const ok = await testConnection();
    setStatus(ok ? "ok" : "fail");
    setTimeout(() => setStatus("idle"), 3000);
  }

  const statusText: Record<Status, string> = {
    idle: "",
    testing: "연결 확인 중...",
    ok: "연결 성공",
    fail: "연결 실패 — URL 또는 토큰을 확인해주세요",
  };

  return (
    <div style={{ padding: 16 }}>
      <form onSubmit={handleSave}>
        <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 12 }}>AED 웹앱 URL</label>
        <input
          type="url"
          value={aedUrl}
          onChange={(e) => setAedUrl(e.target.value)}
          placeholder="https://aed.example.com"
          style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e0", fontSize: 13, marginBottom: 14 }}
        />

        <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 12 }}>
          GitHub Personal Access Token
        </label>
        <input
          type="password"
          value={ghToken}
          onChange={(e) => setGhToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxx"
          style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #cbd5e0", fontSize: 13, marginBottom: 4 }}
        />
        <p style={{ fontSize: 11, color: "#718096", marginBottom: 14 }}>
          repo 권한 포함 토큰이 필요합니다.
        </p>

        {saved && <p style={{ color: "#2f855a", fontSize: 12, marginBottom: 8 }}>저장됐습니다.</p>}
        {status !== "idle" && (
          <p style={{ fontSize: 12, marginBottom: 8, color: status === "ok" ? "#2f855a" : status === "fail" ? "#c53030" : "#718096" }}>
            {statusText[status]}
          </p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: "#2b6cb0", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
          >
            저장
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={status === "testing"}
            style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
          >
            연결 테스트
          </button>
        </div>
      </form>
    </div>
  );
}
