import type { SourceType, PageContext } from "./types";

export function detectSource(url: string): SourceType {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("notion.so") || u.hostname.endsWith("notion.site")) return "notion";
    if (u.hostname === "www.figma.com" && u.pathname.startsWith("/design/")) return "figma";
    if (u.pathname.endsWith(".pdf")) return "pdf";
  } catch {
    // invalid URL
  }
  return "web";
}

function extractNotionPageId(url: string): string | undefined {
  const match = /([a-f0-9]{32})$/.exec(new URL(url).pathname.replace(/-/g, ""));
  return match?.[1];
}

function extractFigmaKeys(url: string): { figmaFileKey?: string; figmaNodeId?: string } {
  const u = new URL(url);
  const figmaFileKey = u.pathname.split("/")[2];
  const figmaNodeId = u.searchParams.get("node-id") ?? undefined;
  return { figmaFileKey, figmaNodeId };
}

export function buildPageContext(url: string, domTitle: string): PageContext {
  const sourceType = detectSource(url);
  const base: PageContext = { sourceType, url, title: domTitle };

  if (sourceType === "notion") {
    return { ...base, notionPageId: extractNotionPageId(url) };
  }
  if (sourceType === "figma") {
    const title = domTitle.replace(/ [–—] Figma$/, "").trim();
    return { ...base, title, ...extractFigmaKeys(url) };
  }
  if (sourceType === "pdf") {
    const fileName = url.split("/").pop()?.replace(".pdf", "") ?? domTitle;
    return { ...base, title: fileName };
  }
  return base;
}
