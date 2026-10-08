import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../api.js';

// Route guard: needs a login, and optionally a role
export default function RequireAuth({ role, children }) {
  const session = useSession();
  const location = useLocation();
  if (!session) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  if (role && session.role !== role) {
    return <main><p className="empty">You need the {role.toLowerCase()} role to see this page.</p></main>;
  }
  return children;
}
