import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../app/store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}