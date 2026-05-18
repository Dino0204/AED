import type { ZodType } from "zod";
import { env } from "./env";
import { githubApi, GithubError } from "./github";

type ContentsResponse = { content: string; sha: string; encoding: "base64" };

const REPO_PATH = `/repos/${env.PORTFOLIO_OWNER}/${env.PORTFOLIO_REPO}/contents`;

export async function getJsonFile<T>(
  token: string,
  path: string,
  schema: ZodType<T>,
  fallback: T,
): Promise<{ data: T; sha: string | null }> {
  try {
    const res = await githubApi<ContentsResponse>(token, "GET", `${REPO_PATH}/${path}`);
    const raw = Buffer.from(res.content, "base64").toString("utf-8");
    const parsed = schema.parse(JSON.parse(raw));
    return { data: parsed, sha: res.sha };
  } catch (err) {
    if (err instanceof GithubError && err.status === 404) {
      return { data: fallback, sha: null };
    }
    throw err;
  }
}

export async function putJsonFile<T>(
  token: string,
  path: string,
  data: T,
  message: string,
  sha: string | null,
): Promise<string> {
  const content = Buffer.from(JSON.stringify(data, null, 2) + "\n", "utf-8").toString("base64");
  const body: Record<string, unknown> = { message, content };
  if (sha) body.sha = sha;

  try {
    const res = await githubApi<{ content: { sha: string } }>(
      token,
      "PUT",
      `${REPO_PATH}/${path}`,
      body,
    );
    return res.content.sha;
  } catch (err) {
    if (err instanceof GithubError && (err.status === 409 || err.status === 422)) {
      const latest = await githubApi<ContentsResponse>(token, "GET", `${REPO_PATH}/${path}`).catch(() => null);
      body.sha = latest?.sha;
      const retry = await githubApi<{ content: { sha: string } }>(
        token,
        "PUT",
        `${REPO_PATH}/${path}`,
        body,
      );
      return retry.content.sha;
    }
    throw err;
  }
}
