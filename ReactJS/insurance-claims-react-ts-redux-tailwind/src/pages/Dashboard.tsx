import { CheckCircle2, Clock3, FileWarning, IndianRupee } from "lucide-react";
import { useAppSelector } from "../hooks";
import StatusBadge from "../components/StatusBadge";
export default function Dashboard({ onClaims }: { onClaims: () => void }) {
  const cs = useAppSelector((s) => s.claims.items);
  const total = cs.reduce((a, c) => a + c.amount, 0);
  const cards = [
    ["Total Claims", cs.length, FileWarning],
    [
      "Under Review",
      cs.filter((c) => c.status === "Under Review").length,
      Clock3,
    ],
    [
      "Approved",
      cs.filter((c) => c.status === "Approved").length,
      CheckCircle2,
    ],
    ["Total Amount", `₹${(total / 100000).toFixed(1)}L`, IndianRupee],
  ] as const;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Monitor claim operations and recent activity.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([l, v, I]) => (
          <div key={l} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">{l}</span>
              <I className="h-5 w-5 text-cyan-600" />
            </div>
            <p className="mt-3 text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex justify-between border-b p-5">
          <div>
            <b>Recent Claims</b>
            <p className="text-sm text-slate-500">Latest claim activity</p>
          </div>
          <button
            onClick={onClaims}
            className="text-sm font-semibold text-cyan-700"
          >
            View all
          </button>
        </div>
        <div className="divide-y">
          {cs.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <b>
                  {c.id} · {c.customer}
                </b>
                <p className="text-sm text-slate-500">
                  {c.policyNumber} · {c.type}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <b>₹{c.amount.toLocaleString("en-IN")}</b>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
