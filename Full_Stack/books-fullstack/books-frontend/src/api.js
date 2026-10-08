import { useSyncExternalStore } from 'react';

// Dev: '/api' is proxied by Vite. For a separately hosted API set VITE_API_URL, e.g. http://localhost:8080/api
const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// ---------- session store (access token + refresh token) ----------
function readSession() {
  try { return JSON.parse(localStorage.getItem('session') || 'null'); } catch { return null; }
}
let session = readSession();
const listeners = new Set();

export const getSession = () => session;
export function setSession(s) {
  session = s;
  if (s) localStorage.setItem('session', JSON.stringify(s)); else localStorage.removeItem('session');
  listeners.forEach((l) => l());
}
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
export const useSession = () => useSyncExternalStore(subscribe, getSession);

/** Turn "/api/books/1/cover?v=x" from the API into a URL that works in dev and production. */
export const assetUrl = (u) => (u ? BASE + u.replace(/^\/api/, '') : null);

// ---------- requests ----------
async function request(path, { method = 'GET', body } = {}, token) {
  const headers = {};
  let payload;
  if (body instanceof FormData) {
    payload = body; // the browser sets the multipart boundary itself
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, { method, headers, body: payload });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const fields = data?.errors ? Object.entries(data.errors).map(([k, v]) => `${k}: ${v}`).join(', ') : null;
    throw new ApiError(fields || data?.detail || `Request failed (${res.status})`, res.status);
  }
  return data;
}

// One refresh at a time, even if several requests fail together
let refreshing = null;
function refreshSession() {
  if (!refreshing) {
    refreshing = request('/auth/refresh', { method: 'POST', body: { refreshToken: session.refreshToken } })
      .then((r) => setSession(r))
      .catch((e) => { setSession(null); throw e; })
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

/** API call with the access token. On 401 it silently refreshes the token and retries once. */
export async function api(path, opts = {}) {
  try {
    return await request(path, opts, session?.accessToken);
  } catch (e) {
    if (e.status === 401 && session && !path.startsWith('/auth/')) {
      try { await refreshSession(); } catch { throw new ApiError('Your session expired. Log in again.', 401); }
      return request(path, opts, session.accessToken);
    }
    throw e;
  }
}
