import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

function StatusBadge({ status }) {
  const cls = status === "OPEN" ? "role-organizer" : status === "CLOSED" ? "" : "";
  return <div className={`roleBadge ${cls}`}>{status}</div>;
}

export default function Conferences() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [closingId, setClosingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/conferences");
      setItems(Array.isArray(res.data) ? res.data : []);
      if (!Array.isArray(res.data)) setError(res.data?.error || "Unexpected response from server");
    } catch (err) {
      setItems([]);
      setError(err.response?.data?.error || "Failed to load conferences");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e) {
    e.preventDefault();
    setError("");

    const payload = {
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      startDate,
      endDate,
    };

    if (!payload.title) return setError("Title is required");
    if (!payload.startDate) return setError("Start date is required");
    if (!payload.endDate) return setError("End date is required");

    setCreating(true);
    try {
      await api.post("/conferences", payload);
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create conference");
    } finally {
      setCreating(false);
    }
  }

  async function closeConference(id) {
    setError("");
    setClosingId(id);
    try {
      await api.patch(`/conferences/${id}/close`);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to close conference");
    } finally {
      setClosingId(null);
    }
  }

  async function deleteConference(id) {
    setError("");

    const ok = window.confirm(
      "Delete this conference?\n\nThis will delete all papers, reviews, and the reviewer pool for this conference."
    );
    if (!ok) return;

    setDeletingId(id);
    try {
      await api.delete(`/conferences/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete conference");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <h3 style={{ marginTop: 0 }}>Conferences</h3>
        <button className="button logout" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 14,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Create conference</div>

        <form className="form" onSubmit={create} style={{ marginTop: 0 }}>
          <label className="label">
            Title
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label className="label">
            Description (optional)
            <textarea
              className="input"
              style={{ minHeight: 90, resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="row">
            <label className="label">
              Start date
              <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>

            <label className="label">
              End date
              <input className="input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>

          <button className="button" type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </button>

          {error ? <div className="error">{error}</div> : null}
        </form>
      </div>

      <div className="sectionTitle">Existing</div>

      {loading ? <p className="hint">Loading...</p> : null}

      {items.length === 0 && !loading ? (
        <p className="hint">No conferences yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 14,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 900 }}>{c.title}</div>
                <StatusBadge status={c.status} />
              </div>

              <div className="hint" style={{ marginTop: 6 }}>
                #{c.id} • {c.startDate} → {c.endDate}
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link className="roleBadge role-organizer" to={`/organizer/conferences/${c.id}/reviewers`}>
                  Reviewer pool
                </Link>

                <Link className="roleBadge role-organizer" to={`/organizer/submissions?conferenceId=${c.id}`}>
                  Submissions
                </Link>

                {c.status === "OPEN" ? (
                  <button className="roleBadge" onClick={() => closeConference(c.id)} disabled={closingId === c.id}>
                    {closingId === c.id ? "Closing..." : "Close"}
                  </button>
                ) : null}

                <button className="roleBadge" onClick={() => deleteConference(c.id)} disabled={deletingId === c.id}>
                  {deletingId === c.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
