const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
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
  const storageKey = kind === "super" ? "pkaymne_super_token" : "pkaymne_admin_token";
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

export function clearApiSession() {
  localStorage.removeItem("pkaymne_admin_token");
  localStorage.removeItem("pkaymne_super_token");
}
