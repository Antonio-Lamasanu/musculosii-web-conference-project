import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "./authStorage";

export default function ProtectedRoute({ roles, children }) {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  const userRole = String(user.role || "").trim().toUpperCase();
  const allowed = Array.isArray(roles) ? roles.map((r) => String(r || "").trim().toUpperCase()) : null;

  if (allowed && !allowed.includes(userRole)) {
    return (
      <div style={{ padding: 18 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>ACCESS BLOCKED</div>

        <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
          <div>
            Tried to open: <span style={{ fontWeight: 900 }}>{location.pathname}</span>
          </div>
          <div>
            Your role: <span style={{ fontWeight: 900 }}>{String(user.role)}</span>
          </div>
          <div>
            Required: <span style={{ fontWeight: 900 }}>{allowed.join(", ")}</span>
          </div>
          <div>
            Your user id: <span style={{ fontWeight: 900 }}>{String(user.id)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="button logout"
            onClick={() => {
              clearCurrentUser();
              window.location.href = "/login";
            }}
          >
            Reset session
          </button>

          <button className="button logout" onClick={() => (window.location.href = "/dashboard")}>
            Back to dashboard
          </button>
        </div>

        <p className="hint" style={{ marginTop: 12 }}>
          If you see this, the route exists but your saved user role is not matching the required role.
        </p>
      </div>
    );
  }

  return children;
}
