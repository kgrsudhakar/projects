import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";
export default function Sidebar({
  active,
  onChange,
}: {
  active: string;
  onChange: (x: string) => void;
}) {
  const items = [
    ["Dashboard", LayoutDashboard],
    ["Claims", FileText],
    ["Customers", Users],
    ["Settings", Settings],
  ] as const;
  return (
    <aside className="hidden w-64 shrink-0 bg-slate-950 text-slate-300 lg:block">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6 text-white">
        <ShieldCheck className="h-7 w-7 text-cyan-400" />
        <b>InsureFlow</b>
      </div>
      <nav className="space-y-1 p-4">
        {items.map(([label, Icon]) => (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm ${active === label ? "bg-cyan-500 text-slate-950" : "hover:bg-slate-800 hover:text-white"}`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
