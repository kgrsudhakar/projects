import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { deleteClaim, updateClaimStatus } from "../features/claims/claimsSlice";
import type { ClaimStatus } from "../types";
const statuses: ClaimStatus[] = [
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];
export default function Claims() {
  const d = useAppDispatch();
  const cs = useAppSelector((s) => s.claims.items);
  const [q, setQ] = useState("");
  const [st, setSt] = useState<ClaimStatus | "All">("All");
  const rows = useMemo(
    () =>
      cs.filter(
        (c) =>
          (c.id + c.customer + c.policyNumber)
            .toLowerCase()
            .includes(q.toLowerCase()) &&
          (st === "All" || c.status === st),
      ),
    [cs, q, st],
  );
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Claims</h2>
        <p className="text-sm text-slate-500">
          Search, filter and manage insurance claims.
        </p>
      </div>
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search claim, customer or policy..."
              className="w-full rounded-lg border px-10 py-2.5 text-sm"
            />
          </div>
          <select
            value={st}
            onChange={(e) => setSt(e.target.value as ClaimStatus | "All")}
            className="rounded-lg border px-3 py-2.5 text-sm"
          >
            <option>All</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {[
                "Claim",
                "Customer",
                "Type",
                "Amount",
                "Date",
                "Status",
                "Actions",
              ].map((x) => (
                <th key={x} className="px-5 py-4">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <b>{c.id}</b>
                  <p className="text-xs text-slate-500">{c.policyNumber}</p>
                </td>
                <td className="px-5 py-4">{c.customer}</td>
                <td className="px-5 py-4">{c.type}</td>
                <td className="px-5 py-4">
                  ₹{c.amount.toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-4">{c.submittedDate}</td>
                <td className="px-5 py-4">
                  <select
                    value={c.status}
                    onChange={(e) =>
                      d(
                        updateClaimStatus({
                          id: c.id,
                          status: e.target.value as ClaimStatus,
                        }),
                      )
                    }
                    className="rounded border-0 bg-transparent"
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => d(deleteClaim(c.id))}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="p-10 text-center text-slate-500">
            No claims found.
          </div>
        )}
      </div>
    </div>
  );
}
