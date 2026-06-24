import type { ApiErrorResponse } from "./contracts";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

const ACCESS_TOKEN_KEY = "pkaymne_access_token";
const REFRESH_TOKEN_KEY = "pkaymne_refresh_token";
const ROLE_KEY = "pkaymne_session_role";
const LEGACY_ADMIN_TOKEN_KEY = "pkaymne_admin_token";
const LEGACY_SUPER_TOKEN_KEY = "pkaymne_super_token";

type RequestOptions = RequestInit & {
  token?: string | null;
  skipJsonHeader?: boolean;
  skipAuthRefresh?: boolean;
};

type ApiSession = {
  access_token: string;
  refresh_token?: string | null;
  user?: { role?: string };
};

export class ApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, string[]>;
  requestId?: string;

  constructor(status: number, payload: ApiErrorResponse["error"]) {
    super(payload.message);
    this.name = "ApiError";
    this.status = status;
    this.code = payload.code;
    this.details = payload.details;
    this.requestId = payload.request_id;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await sendRequest(path, options);
  if (
    response.status === 401 &&
    !options.skipAuthRefresh &&
    !path.startsWith("/auth/") &&
    getStoredRefreshToken()
  ) {
    const refreshed = await refreshApiSession();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, token: refreshed.access_token, skipAuthRefresh: true });
    }
  }
  if (!response.ok) {
    throw await toApiError(response);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

async function sendRequest(path: string, options: RequestOptions) {
  const { skipJsonHeader, token, skipAuthRefresh, ...fetchOptions } = options;
  void skipAuthRefresh;
  const headers = new Headers(options.headers);
  const requestToken = token === undefined ? getStoredToken() : token;
  if (!skipJsonHeader && fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (requestToken) {
    headers.set("Authorization", `Bearer ${requestToken}`);
  }
  return fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });
}

async function toApiError(response: Response) {
  const requestId = response.headers.get("x-request-id") ?? undefined;
  try {
    const body = (await response.json()) as ApiErrorResponse;
    if (body.error) {
      return new ApiError(response.status, { ...body.error, request_id: body.error.request_id || requestId || "" });
    }
  } catch {
    // Fall through to the status-based error.
  }
  return new ApiError(response.status, {
    code: "request_error",
    message: `Request failed with status ${response.status}.`,
    request_id: requestId || "",
  });
}

export async function refreshApiSession(): Promise<ApiSession | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;
  try {
    const response = await apiRequest<ApiSession>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      token: null,
      skipAuthRefresh: true,
    });
    storeApiSession(response);
    return response;
  } catch {
    clearApiSession();
    return null;
  }
}

export async function logoutApiSession() {
  const refreshToken = getStoredRefreshToken();
  if (refreshToken) {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
        token: null,
        skipAuthRefresh: true,
      });
    } catch {
      // Local logout must still succeed if the API is unavailable.
    }
  }
  clearApiSession();
}

export async function getDemoToken(kind: "admin" | "super" = "admin") {
  const existing = getStoredToken();
  if (existing) return existing;
  if (!import.meta.env.DEV) {
    throw new ApiError(401, {
      code: "unauthenticated",
      message: "Please sign in to continue.",
      request_id: "",
    });
  }
  const credentials =
    kind === "super"
      ? { email: "super@pkaymne.local", password: "Password123!" }
      : { email: "admin@pkaymne.local", password: "Password123!" };
  const session = await loginWithPassword(credentials.email, credentials.password);
  return session.access_token;
}

export function getStoredToken() {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_SUPER_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_ADMIN_TOKEN_KEY)
  );
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function storeApiSession(session: ApiSession | string, kind: "admin" | "super" = "admin") {
  const normalized =
    typeof session === "string"
      ? { access_token: session, user: { role: kind === "super" ? "platform_admin" : "organization_admin" } }
      : session;
  localStorage.setItem(ACCESS_TOKEN_KEY, normalized.access_token);
  if (normalized.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, normalized.refresh_token);
  }
  if (normalized.user?.role) {
    localStorage.setItem(ROLE_KEY, normalized.user.role);
  }
  localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
  localStorage.removeItem(LEGACY_SUPER_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent("pkaymne:session", { detail: { authenticated: true } }));
}

export async function loginWithPassword(email: string, password: string) {
  const session = await apiRequest<ApiSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    token: null,
    skipAuthRefresh: true,
  });
  storeApiSession(session);
  return session;
}

export function clearApiSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
  localStorage.removeItem(LEGACY_SUPER_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent("pkaymne:session", { detail: { authenticated: false } }));
}
