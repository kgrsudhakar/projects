import { useEffect, useState } from 'react'
import { api } from './api'

const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
const btn = 'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'
const badge = { ACTIVE: 'bg-green-100 text-green-700', SUBMITTED: 'bg-amber-100 text-amber-700', APPROVED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' }

function Policies({ policies, reload, setErr }) {
  const [f, setF] = useState({ holderName: '', type: 'HEALTH', premium: '', startDate: '', endDate: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault(); setErr('')
    try { await api.addPolicy({ ...f, premium: Number(f.premium) }); setF({ ...f, holderName: '', premium: '' }); reload() } catch (x) { setErr(x.message) }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submit} className="space-y-3 rounded-xl bg-white p-5 shadow">
        <h2 className="font-semibold">New policy</h2>
        <input className={input} placeholder="Holder name" value={f.holderName} onChange={set('holderName')} required />
        <select className={input} value={f.type} onChange={set('type')}>{['HEALTH', 'AUTO', 'HOME', 'LIFE'].map(t => <option key={t}>{t}</option>)}</select>
        <input className={input} type="number" placeholder="Premium" value={f.premium} onChange={set('premium')} required />
        <input className={input} type="date" value={f.startDate} onChange={set('startDate')} required />
        <input className={input} type="date" value={f.endDate} onChange={set('endDate')} required />
        <button className={btn}>Create</button>
      </form>
      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow lg:col-span-2">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500"><tr><th className="py-2">ID</th><th>Holder</th><th>Type</th><th>Premium</th><th>Status</th><th /></tr></thead>
          <tbody>{policies.map(p => (
            <tr key={p.id} className="border-t">
              <td className="py-2">{p.id}</td><td>{p.holderName}</td><td>{p.type}</td><td>${p.premium}</td>
              <td><span className={`rounded-full px-2 py-0.5 text-xs ${badge[p.status]}`}>{p.status}</span></td>
              <td><button className="text-red-600 hover:underline" onClick={() => api.deletePolicy(p.id).then(reload)}>Delete</button></td>
            </tr>))}
          </tbody>
        </table>
        {!policies.length && <p className="py-6 text-center text-slate-400">No policies yet</p>}
      </div>
    </div>
  )
}

function Claims({ claims, reload, setErr }) {
  const [f, setF] = useState({ policyId: '', description: '', amount: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault(); setErr('')
    try { await api.addClaim({ ...f, policyId: Number(f.policyId), amount: Number(f.amount) }); setF({ policyId: '', description: '', amount: '' }); reload() } catch (x) { setErr(x.message) }
  }
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submit} className="space-y-3 rounded-xl bg-white p-5 shadow">
        <h2 className="font-semibold">File a claim</h2>
        <input className={input} type="number" placeholder="Policy ID" value={f.policyId} onChange={set('policyId')} required />
        <input className={input} placeholder="Description" value={f.description} onChange={set('description')} required />
        <input className={input} type="number" placeholder="Amount" value={f.amount} onChange={set('amount')} required />
        <button className={btn}>Submit</button>
      </form>
      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow lg:col-span-2">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500"><tr><th className="py-2">ID</th><th>Policy</th><th>Description</th><th>Amount</th><th>Status</th><th /></tr></thead>
          <tbody>{claims.map(c => (
            <tr key={c.id} className="border-t">
              <td className="py-2">{c.id}</td><td>{c.policyId}</td><td>{c.description}</td><td>${c.amount}</td>
              <td><span className={`rounded-full px-2 py-0.5 text-xs ${badge[c.status]}`}>{c.status}</span></td>
              <td className="space-x-2">
                <button className="text-green-600 hover:underline" onClick={() => api.setClaimStatus(c.id, 'APPROVED').then(reload)}>Approve</button>
                <button className="text-red-600 hover:underline" onClick={() => api.setClaimStatus(c.id, 'REJECTED').then(reload)}>Reject</button>
              </td>
            </tr>))}
          </tbody>
        </table>
        {!claims.length && <p className="py-6 text-center text-slate-400">No claims yet</p>}
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('policies')
  const [policies, setPolicies] = useState([])
  const [claims, setClaims] = useState([])
  const [err, setErr] = useState('')
  const reload = () => { api.policies().then(setPolicies).catch(e => setErr(e.message)); api.claims().then(setClaims).catch(e => setErr(e.message)) }
  useEffect(reload, [])
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-indigo-700 text-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold">SafeGuard Insurance</h1>
        <nav className="space-x-2">{['policies', 'claims'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${tab === t ? 'bg-white text-indigo-700' : 'hover:bg-indigo-600'}`}>{t}</button>))}
        </nav></div></header>
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        {err && <div className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{err}</div>}
        {tab === 'policies' ? <Policies {...{ policies, reload, setErr }} /> : <Claims {...{ claims, reload, setErr }} />}
      </main>
    </div>
  )
}
