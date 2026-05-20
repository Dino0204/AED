interface Props {
  children: React.ReactNode;
  hasSettings: boolean;
  onGoSettings: () => void;
}

export function AuthGate({ children, hasSettings, onGoSettings }: Props) {
  if (!hasSettings) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p style={{ marginBottom: 16, color: "#4a5568", lineHeight: 1.6 }}>
          AED와 연결하려면<br />설정 탭에서 URL과 토큰을 입력해주세요.
        </p>
        <button
          onClick={onGoSettings}
          style={{
            padding: "8px 20px", borderRadius: 6, border: "none",
            background: "#2b6cb0", color: "#fff", fontWeight: 600, cursor: "pointer",
          }}
        >
          설정으로 이동
        </button>
      </div>
    );
  }
  return <>{children}</>;
}
