const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
async function req(path, opts = {}) {
  const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error || `Request failed (${res.status})`) }
  return res.status === 204 ? null : res.json()
}
export const api = {
  policies: () => req('/policies'),
  addPolicy: (p) => req('/policies', { method: 'POST', body: JSON.stringify(p) }),
  deletePolicy: (id) => req(`/policies/${id}`, { method: 'DELETE' }),
  claims: () => req('/claims'),
  addClaim: (c) => req('/claims', { method: 'POST', body: JSON.stringify(c) }),
  setClaimStatus: (id, status) => req(`/claims/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}
