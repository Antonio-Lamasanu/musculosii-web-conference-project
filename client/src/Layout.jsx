import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearCurrentUser, getCurrentUser } from "./authStorage";

export default function Layout() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  function logout() {
    clearCurrentUser();
    navigate("/login");
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 920 }}>
        <div className="topbar">
          <div style={{ fontWeight: 800, fontSize: 18 }}>Conference App</div>

          <div className={`roleBadge role-${(user?.role || "author").toLowerCase()}`} style={{ marginLeft: 10 }}>
            {user?.role || "GUEST"}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="roleBadge" to="/dashboard">Dashboard</Link>

            {user?.role === "AUTHOR" ? (
              <>
                <Link className="roleBadge role-author" to="/author/submit">Submit</Link>
                <Link className="roleBadge role-author" to="/author/papers">My Papers</Link>
              </>
            ) : null}

            {user?.role === "REVIEWER" ? (
              <Link className="roleBadge role-reviewer" to="/reviewer/assigned">Assigned</Link>
            ) : null}

            {user?.role === "ORGANIZER" ? (
              <>
                <Link className="roleBadge role-organizer" to="/organizer/conferences">Conferences</Link>
                <Link className="roleBadge role-organizer" to="/organizer/submissions">Submissions</Link>
              </>
            ) : null}

            <button className="button logout" onClick={logout}>Logout</button>
          </div>
        </div>

        <hr style={{ margin: "18px 0", opacity: 0.25 }} />

        <Outlet />
      </div>
    </div>
  );
}
