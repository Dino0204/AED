export type SourceType = "notion" | "figma" | "pdf" | "web";

export interface PageContext {
  sourceType: SourceType;
  url: string;
  title: string;
  notionPageId?: string;
  figmaFileKey?: string;
  figmaNodeId?: string;
}

export interface AedIssue {
  number: number;
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  target_id: string;
  ai_suggestion: "add" | "remove" | "keep";
  ai_reason: string;
  target_title: string;
}

export interface Memo {
  id: string;
  date: string;
  content: string;
}

export interface ExtensionSettings {
  aedUrl: string;
  ghToken: string | null;
}
