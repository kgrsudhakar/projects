import { useState } from "react";
export default function Settings() {
  const [n, setN] = useState(true);
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-slate-500">Application preferences.</p>
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <label className="flex items-center justify-between">
          <div>
            <b>Claim notifications</b>
            <p className="text-sm text-slate-500">
              Notify about status changes.
            </p>
          </div>
          <input
            type="checkbox"
            checked={n}
            onChange={(e) => setN(e.target.checked)}
            className="h-5 w-5"
          />
        </label>
      </div>
    </div>
  );
}
