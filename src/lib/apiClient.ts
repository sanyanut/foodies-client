// Thin fetch wrapper around the Foodies API.
//
// Responsibilities:
//  - prefix requests with VITE_API_URL and always send cookies (the refresh
//    token is an httpOnly cookie scoped to /auth);
//  - attach `Authorization: Bearer <accessToken>` for authenticated calls;
//  - transparently handle 401 by calling POST /auth/refresh once (single-flight)
//    and retrying; if that fails, clear the token and notify the app.
//
// It deliberately does NOT import the Redux store — auth state flows one way
// (authSlice -> apiClient) to avoid an import cycle. The access token lives here
// (mirrored to localStorage) and the app registers a failure handler.

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "foodies.accessToken";

let accessToken: string | null = localStorage.getItem(TOKEN_KEY);
let onAuthFailure: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAccessToken(): string | null {
  return accessToken;
}

/** Called when a refresh attempt fails — lets the app force a client logout. */
export function registerAuthFailureHandler(fn: () => void): void {
  onAuthFailure = fn;
}

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;
  constructor(status: number, message: string, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: string;
  /** JSON body — serialized automatically. */
  body?: unknown;
  /** Attach the Bearer access token (and refresh-on-401). */
  auth?: boolean;
  signal?: AbortSignal;
}

function buildInit(opts: RequestOptions, token: string | null): RequestInit {
  const headers: Record<string, string> = {};
  const init: RequestInit = {
    method: opts.method ?? "GET",
    credentials: "include",
    headers,
    signal: opts.signal,
  };
  if (opts.body !== undefined) {
    if (opts.body instanceof FormData) {
      init.body = opts.body;
    } else {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(opts.body);
    }
  }
  if (opts.auth && token) headers["Authorization"] = `Bearer ${token}`;
  return init;
}

let refreshing: Promise<string | null> | null = null;

/** Single-flight refresh: concurrent 401s share one /auth/refresh call. */
function refreshAccessToken(): Promise<string | null> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { accessToken: string };
        setAccessToken(data.accessToken);
        return data.accessToken;
      } catch {
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

interface ErrorBody {
  error?: string;
  message?: string;
  details?: Record<string, string[]>;
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return undefined;
  const text = await res.text();
  return text ? JSON.parse(text) : undefined;
}

export async function apiRequest<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  let res = await fetch(`${API_URL}${path}`, buildInit(opts, accessToken));

  if (res.status === 401 && opts.auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await fetch(`${API_URL}${path}`, buildInit(opts, newToken));
    } else {
      setAccessToken(null);
      onAuthFailure?.();
    }
  }

  const data = await parseBody(res);
  if (!res.ok) {
    const body = (data ?? {}) as ErrorBody;
    const message = body.error || body.message || `Request failed (${res.status})`;
    throw new ApiError(res.status, message, body.details);
  }
  return data as T;
}
