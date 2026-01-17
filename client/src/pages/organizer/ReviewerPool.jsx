import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";

export default function ReviewerPool() {
  const { id } = useParams();
  const conferenceId = Number(id);

  const [reviewers, setReviewers] = useState([]);
  const [pool, setPool] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r1 = await api.get("/users?role=REVIEWER");
      const r2 = await api.get(`/conferences/${conferenceId}/reviewers`);

      if (!Array.isArray(r1.data)) {
        setReviewers([]);
        setPool([]);
        setError(r1.data?.error || "Unexpected /users response");
        return;
      }

      if (!Array.isArray(r2.data)) {
        setReviewers(r1.data);
        setPool([]);
        setError(r2.data?.error || "Unexpected /conferences/:id/reviewers response");
        return;
      }

      setReviewers(r1.data);
      setPool(r2.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load reviewers/pool");
      setReviewers([]);
      setPool([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [conferenceId]);

  async function add(e) {
    e.preventDefault();
    setError("");

    const reviewerId = Number(selectedId);
    if (!reviewerId) return setError("Select a reviewer");

    setAdding(true);
    try {
      await api.post(`/conferences/${conferenceId}/reviewers`, { reviewerId });
      setSelectedId("");
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add reviewer");
    } finally {
      setAdding(false);
    }
  }

  const poolIds = useMemo(() => new Set(pool.map((x) => x.reviewerId)), [pool]);
  const byId = useMemo(() => {
    const m = new Map();
    reviewers.forEach((u) => m.set(u.id, u));
    return m;
  }, [reviewers]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h3 style={{ marginTop: 0 }}>Reviewer Pool • Conference #{conferenceId}</h3>
        <Link className="roleBadge role-organizer" to="/organizer/conferences">
          Back
        </Link>
      </div>

      {loading ? <p className="hint">Loading...</p> : null}
      {error ? <div className="error">{error}</div> : null}

      <form className="form" onSubmit={add}>
        <label className="label">
          Add reviewer
          <select className="select" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} disabled={adding}>
            <option value="">Select...</option>
            {reviewers.map((u) => (
              <option key={u.id} value={u.id} disabled={poolIds.has(u.id)}>
                {u.name} ({u.email}) {poolIds.has(u.id) ? "— in pool" : ""}
              </option>
            ))}
          </select>
        </label>

        <button className="button" type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add to pool"}
        </button>
      </form>

      <div className="sectionTitle">Current pool</div>

      {pool.length === 0 ? (
        <p className="hint">No reviewers yet. Add at least 2 to allow paper submissions.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {pool.map((x) => {
            const u = byId.get(x.reviewerId);
            return (
              <div
                key={x.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 12,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>{u ? u.name : `Reviewer ${x.reviewerId}`}</div>
                  <div className="roleBadge role-reviewer">REVIEWER</div>
                </div>
                <div className="hint" style={{ marginTop: 6 }}>
                  reviewerId: {x.reviewerId}
                  {u ? ` • ${u.email}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
