import { Link, Navigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../authStorage";

function OrganizerPanel() {
  return (
    <>
      <ul className="list">
        <li>Create conferences</li>
        <li>Manage reviewer pool</li>
        <li>Monitor all submissions</li>
        <li>Read paper text + reviews</li>
      </ul>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="roleBadge role-organizer" to="/organizer/conferences">
          Conferences
        </Link>
        <Link className="roleBadge role-organizer" to="/organizer/submissions">
          Submissions
        </Link>
      </div>

      <p className="hint">Use these buttons to manage conferences and submissions.</p>
    </>
  );
}

function ReviewerPanel() {
  return (
    <>
      <ul className="list">
        <li>View assigned papers</li>
        <li>Read the paper title + content</li>
        <li>Submit score + feedback</li>
      </ul>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="roleBadge role-reviewer" to="/reviewer/assigned">
          Assigned papers
        </Link>
      </div>

      <p className="hint">Assigned papers appear in the menu.</p>
    </>
  );
}

function AuthorPanel() {
  return (
    <>
      <ul className="list">
        <li>Submit a paper</li>
        <li>Write the full paper content</li>
        <li>Upload revisions if required</li>
        <li>Track review status</li>
      </ul>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="roleBadge role-author" to="/author/submit">
          Submit paper
        </Link>
        <Link className="roleBadge role-author" to="/author/papers">
          My papers
        </Link>
      </div>

      <p className="hint">Use these buttons to manage your papers.</p>
    </>
  );
}

export default function Dashboard() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  function resetSession() {
    clearCurrentUser();
    window.location.href = "/login";
  }

  function logout() {
    clearCurrentUser();
    window.location.href = "/login";
  }

  return (
    <>
      <div className="topbar">
        <img className="avatar" src={user.avatarUrl} alt="avatar" />
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{user.name}</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{user.email}</div>
          <div className={`roleBadge role-${String(user.role).toLowerCase()}`}>{user.role}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="button logout" onClick={resetSession}>
            Reset session
          </button>
          <button className="button logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="sectionTitle">Your dashboard</div>

      {user.role === "ORGANIZER" ? <OrganizerPanel /> : user.role === "REVIEWER" ? <ReviewerPanel /> : <AuthorPanel />}
    </>
  );
}
