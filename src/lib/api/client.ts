const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";
const ADMIN_TOKEN_KEY = "pkaymne_admin_token";
const SUPER_TOKEN_KEY = "pkaymne_super_token";

type RequestOptions = RequestInit & {
  token?: string | null;
  skipJsonHeader?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipJsonHeader, token, ...fetchOptions } = options;
  const headers = new Headers(options.headers);
  if (!skipJsonHeader) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...fetchOptions, headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export async function getDemoToken(kind: "admin" | "super" = "admin") {
  const storageKey = kind === "super" ? SUPER_TOKEN_KEY : ADMIN_TOKEN_KEY;
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;
  const credentials =
    kind === "super"
      ? { email: "super@pkaymne.local", password: "Password123!" }
      : { email: "admin@pkaymne.local", password: "Password123!" };
  const session = await apiRequest<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  localStorage.setItem(storageKey, session.access_token);
  return session.access_token;
}

export function getStoredToken(kind: "admin" | "super" = "admin") {
  return localStorage.getItem(kind === "super" ? SUPER_TOKEN_KEY : ADMIN_TOKEN_KEY);
}

export function storeApiSession(accessToken: string, kind: "admin" | "super" = "admin") {
  localStorage.setItem(kind === "super" ? SUPER_TOKEN_KEY : ADMIN_TOKEN_KEY, accessToken);
}

export async function loginWithPassword(email: string, password: string) {
  const session = await apiRequest<{ access_token: string; user?: { role?: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  storeApiSession(session.access_token, session.user?.role === "platform_admin" ? "super" : "admin");
  return session;
}

export function clearApiSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(SUPER_TOKEN_KEY);
}
