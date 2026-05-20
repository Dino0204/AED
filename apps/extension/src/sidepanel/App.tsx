import { useEffect, useState } from "react";
import type { ExtensionSettings, PageContext } from "../lib/types";
import { getSettings, onSettingsChanged } from "../lib/storage";
import { SourceBadge } from "./components/SourceBadge";
import { AuthGate } from "./components/AuthGate";
import { SuggestionsView } from "./views/SuggestionsView";
import { MemoView } from "./views/MemoView";
import { SettingsView } from "./views/SettingsView";

type Tab = "suggestions" | "memo" | "settings";

function useSettings() {
  const [settings, setSettingsState] = useState<ExtensionSettings | null>(null);
  useEffect(() => {
    getSettings().then(setSettingsState);
    return onSettingsChanged(setSettingsState);
  }, []);
  return settings;
}

function usePageContext() {
  const [ctx, setCtx] = useState<PageContext | null>(null);
  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "TAB_CHANGED") {
        setCtx({ sourceType: msg.sourceType, url: msg.url, title: msg.title });
      }
    });
    chrome.runtime.sendMessage({ type: "GET_PAGE_CONTEXT" }, (res) => {
      if (res) setCtx(res as PageContext);
    });
  }, []);
  return ctx;
}

const TAB_LABELS: { id: Tab; label: string }[] = [
  { id: "suggestions", label: "AI 제안" },
  { id: "memo", label: "메모" },
  { id: "settings", label: "설정" },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("suggestions");
  const settings = useSettings();
  const pageContext = usePageContext();

  const hasSettings = !!(settings?.aedUrl && settings?.ghToken);

  function goSettings() { setTab("settings"); }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 헤더 */}
      <div style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>AED</span>
        {pageContext && <SourceBadge type={pageContext.sourceType} />}
      </div>

      {/* 탭 네비게이션 */}
      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
        {TAB_LABELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1, padding: "8px 0", border: "none", background: "none",
              fontSize: 12, fontWeight: tab === id ? 700 : 400,
              color: tab === id ? "#2b6cb0" : "#718096",
              borderBottom: tab === id ? "2px solid #2b6cb0" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "settings" ? (
          <SettingsView />
        ) : (
          <AuthGate hasSettings={hasSettings} onGoSettings={goSettings}>
            {tab === "suggestions" && <SuggestionsView />}
            {tab === "memo" && <MemoView pageContext={pageContext} />}
          </AuthGate>
        )}
      </div>

      {/* 현재 페이지 URL (하단 표시) */}
      {pageContext && (
        <div style={{ padding: "4px 12px", borderTop: "1px solid #e2e8f0", fontSize: 10, color: "#a0aec0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {pageContext.url}
        </div>
      )}
    </div>
  );
}
