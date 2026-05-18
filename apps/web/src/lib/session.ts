import { cookies } from "next/headers";

const SESSION_COOKIE = "gh_token";
const STATE_COOKIE = "gh_oauth_state";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const STATE_MAX_AGE = 60 * 10;

const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, { ...cookieDefaults, maxAge: SESSION_MAX_AGE });
}

export async function clearSessionToken(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function setOAuthState(state: string): Promise<void> {
  const store = await cookies();
  store.set(STATE_COOKIE, state, { ...cookieDefaults, maxAge: STATE_MAX_AGE });
}

export async function consumeOAuthState(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(STATE_COOKIE)?.value ?? null;
  if (value) store.delete(STATE_COOKIE);
  return value;
}

export async function requireSessionToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) throw new Response("Unauthorized", { status: 401 });
  return token;
}
