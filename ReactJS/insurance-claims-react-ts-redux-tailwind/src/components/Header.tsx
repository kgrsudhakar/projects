import { Bell, LogOut, UserCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../features/auth/authSlice";
export default function Header() {
  const d = useAppDispatch();
  const u = useAppSelector((s) => s.auth.user);
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div>
        <b>Claims Management Portal</b>
        <p className="hidden text-xs text-slate-500 sm:block">
          Enterprise insurance operations
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="h-5 w-5 text-slate-500" />
        <div className="hidden sm:flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-slate-400" />
          <div>
            <p className="text-sm font-medium">{u?.name}</p>
            <p className="text-xs text-slate-500">{u?.role}</p>
          </div>
        </div>
        <button onClick={() => d(logout())}>
          <LogOut className="h-5 w-5 text-slate-500" />
        </button>
      </div>
    </header>
  );
}
