import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/login/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import PolicyListPage from "../pages/Policy/PolicyListPage";
import ClaimListPage from "../pages/claim/ClaimListPage";
import UserListPage from "../pages/Users/UserListPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/policies"
          element={<PolicyListPage />}
        />

        <Route
          path="/claims"
          element={<ClaimListPage />}
        />

        <Route
          path="/users"
          element={<UserListPage />}
        />
      </Route>
    </Routes>
  );
}