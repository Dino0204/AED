const API = "https://api.github.com";

export class GithubError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(`GitHub ${status}: ${message}`);
  }
}

export async function githubApi<T = unknown>(
  token: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new GithubError(res.status, (data as { message?: string })?.message ?? res.statusText, data);
  return data as T;
}

export async function getCurrentUser(token: string) {
  return githubApi<{ login: string; name: string | null; avatar_url: string }>(
    token,
    "GET",
    "/user",
  );
}
