import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Mirrors the backend's two-step check: authenticate() first (is there a
 * logged-in user at all?), then authorize(...roles) (is this role allowed?).
 * This is a client-side convenience only -- the real enforcement always
 * happens on the backend. This just avoids showing/flashing a page the
 * API would reject anyway.
 */
export function ProtectedRoute({ children, roles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-6 py-16 text-slate-muted">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/issues" replace />;
  }

  return children;
}
