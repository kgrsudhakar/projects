import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import { useAppSelector } from "./hooks";

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const ok = useAppSelector((s) => s.auth.isAuthenticated);
  if (!ok)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="rounded-xl bg-white p-8">
          Session ended. Refresh to restore demo login.
        </div>
      </div>
    );
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active={active} onChange={setActive} />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          {active === "Dashboard" && (
            <Dashboard onClaims={() => setActive("Claims")} />
          )}{" "}
          {active === "Claims" && <Claims />}
          {active === "Customers" && <Customers />}
          {active === "Settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}
