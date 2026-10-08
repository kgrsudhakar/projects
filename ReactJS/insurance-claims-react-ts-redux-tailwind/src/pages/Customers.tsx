import { useAppSelector } from "../hooks";
export default function Customers() {
  const cs = useAppSelector((s) => s.claims.items);
  const customers = Array.from(
    new Map(cs.map((c) => [c.customer, c])).values(),
  );
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Customers</h2>
        <p className="text-sm text-slate-500">
          Customer records from the claims domain.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((c) => (
          <div
            key={c.customer}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <b>{c.customer}</b>
            <p className="text-sm text-slate-500">{c.policyNumber}</p>
            <p className="mt-4 text-sm">
              Claim: <b>{c.id}</b>
            </p>
            <p className="text-sm">
              Type: <b>{c.type}</b>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
