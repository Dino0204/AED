import { githubApi } from "./github";
import { env } from "./env";

export type AedIssue = {
  number: number;
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  target_id: string;
  ai_suggestion: "add" | "remove" | "keep";
  ai_reason: string;
  target_title: string;
};

type GhIssue = {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  created_at: string;
  pull_request?: unknown;
};

export async function listAedSuggestionIssues(token: string): Promise<AedIssue[]> {
  const issues = await githubApi<GhIssue[]>(
    token,
    "GET",
    `/repos/${env.PORTFOLIO_OWNER}/${env.PORTFOLIO_REPO}/issues?labels=aed-suggestion&state=open&per_page=50`,
  );
  return issues
    .filter((i) => !i.pull_request)
    .map((i) => {
      const body = i.body ?? "";
      const target_id = /<!--\s*target_id:\s*([^\s>]+)\s*-->/.exec(body)?.[1] ?? "";
      const suggestionMatch = /<!--\s*suggestion:\s*(add|remove|keep)\s*-->/.exec(body)?.[1];
      const ai_suggestion = (suggestionMatch ?? "keep") as AedIssue["ai_suggestion"];
      const ai_reason = /\*\*근거\*\*:\s*([\s\S]+?)(?:\n\n|---|$)/.exec(body)?.[1]?.trim() ?? "";
      const target_title = /\*\*대상\*\*:\s*(.+?)(?:\n|$)/.exec(body)?.[1]?.trim() ?? target_id;
      return {
        number: i.number,
        title: i.title,
        body,
        html_url: i.html_url,
        created_at: i.created_at,
        target_id,
        ai_suggestion,
        ai_reason,
        target_title,
      };
    })
    .filter((i) => i.target_id);
}

export async function closeIssueWithLabel(
  token: string,
  issueNumber: number,
  accepted: boolean,
): Promise<void> {
  const newLabel = accepted ? "aed-accepted" : "aed-rejected";
  await githubApi(
    token,
    "PATCH",
    `/repos/${env.PORTFOLIO_OWNER}/${env.PORTFOLIO_REPO}/issues/${issueNumber}`,
    {
      state: "closed",
      state_reason: accepted ? "completed" : "not_planned",
      labels: ["aed-suggestion", newLabel],
    },
  );
}
