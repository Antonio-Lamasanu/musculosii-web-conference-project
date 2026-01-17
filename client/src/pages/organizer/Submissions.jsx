import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api";

export default function Submissions() {
  const [searchParams] = useSearchParams();
  const conferenceIdParam = searchParams.get("conferenceId");
  const conferenceIdFilter = conferenceIdParam ? Number(conferenceIdParam) : null;

  const [papers, setPapers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/papers/all");
      if (!Array.isArray(res.data)) {
        setPapers([]);
        setError(res.data?.error || "Unexpected response from server");
        return;
      }
      setPapers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load submissions");
      setPapers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!conferenceIdFilter) return papers;
    return papers.filter((p) => Number(p.conferenceId) === conferenceIdFilter);
  }, [papers, conferenceIdFilter]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: 6 }}>All Submissions</h3>
          {conferenceIdFilter ? <div className="hint">Filtered by conference #{conferenceIdFilter}</div> : null}
        </div>

        <button className="button logout" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading ? <p className="hint">Loading...</p> : null}
      {error ? <div className="error">{error}</div> : null}

      {!loading && !error && filtered.length === 0 ? (
        <p className="hint">{conferenceIdFilter ? "No submissions for this conference." : "No submissions yet."}</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 14,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 800 }}>{p.title}</div>
                <div className="roleBadge role-organizer">{p.status}</div>
              </div>

              <div className="hint" style={{ marginTop: 6 }}>
                Paper #{p.id} • Conference: {p.conferenceId} • Author: {p.authorId} • Version: {p.version}
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {p.fileUrl ? (
                  <a className="roleBadge" href={p.fileUrl} target="_blank" rel="noreferrer">
                    Open file (mock)
                  </a>
                ) : null}

                <Link className="roleBadge role-organizer" to={`/organizer/submissions/${p.id}`}>
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
