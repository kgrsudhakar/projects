import type { ClaimStatus } from "../types";
export default function StatusBadge({ status }: { status: ClaimStatus }) {
  const s: Record<ClaimStatus, string> = {
    Submitted: "bg-blue-50 text-blue-700",
    "Under Review": "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${s[status]}`}
    >
      {status}
    </span>
  );
}
