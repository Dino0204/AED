import type { SourceType } from "../../lib/types";

const LABELS: Record<SourceType, string> = {
  notion: "Notion",
  figma: "Figma",
  pdf: "PDF",
  web: "Web",
};

const COLORS: Record<SourceType, string> = {
  notion: "#000",
  figma: "#a259ff",
  pdf: "#e53e3e",
  web: "#2b6cb0",
};

export function SourceBadge({ type }: { type: SourceType }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "1px 8px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      color: "#fff",
      background: COLORS[type],
    }}>
      {LABELS[type]}
    </span>
  );
}
