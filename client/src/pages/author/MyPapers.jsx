import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function MyPapers() {
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/papers/mine");
      if (!Array.isArray(res.data)) {
        setPapers([]);
        setError(res.data?.error || "Unexpected response from server");
        return;
      }
      setPapers(res.data);
    } catch (err) {
      setPapers([]);
      setError(err.response?.data?.error || "Failed to load your papers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function canUploadRevision(status) {
    return status === "REVISION_REQUIRED";
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <h3 style={{ marginTop: 0 }}>My Papers</h3>
        <button className="button logout" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading ? <p className="hint">Loading...</p> : null}
      {error ? <div className="error">{error}</div> : null}

      {!loading && !error && papers.length === 0 ? (
        <p className="hint">You haven’t submitted any papers yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {papers.map((p) => {
            const reviews = Array.isArray(p.reviews) ? p.reviews : [];
            const submitted = reviews.filter((r) => r.status === "SUBMITTED").length;

            return (
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
                  <div style={{ fontWeight: 900 }}>{p.title}</div>
                  <div className="roleBadge role-author">{p.status}</div>
                </div>

                <div className="hint" style={{ marginTop: 6 }}>
                  Paper #{p.id} • Conference {p.conferenceId} • Version {p.version}
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {p.fileUrl ? (
                    <a className="roleBadge" href={p.fileUrl} target="_blank" rel="noreferrer">
                      Open file (mock)
                    </a>
                  ) : null}

                  {canUploadRevision(p.status) ? (
                    <Link className="roleBadge role-author" to={`/author/revision/${p.id}`}>
                      Upload revision
                    </Link>
                  ) : null}
                </div>

                <div className="sectionTitle">Abstract</div>
                <div style={{ whiteSpace: "pre-wrap", color: "var(--muted)" }}>{p.abstract || "-"}</div>

                <div className="sectionTitle">Paper content</div>
                <div style={{ whiteSpace: "pre-wrap", color: "var(--muted)" }}>{p.content || "-"}</div>

                <div className="sectionTitle">Reviews</div>

                {reviews.length === 0 ? (
                  <p className="hint" style={{ marginTop: 0 }}>
                    No reviews yet.
                  </p>
                ) : (
                  <>
                    <div className="hint" style={{ marginTop: -6, marginBottom: 10 }}>
                      Submitted: {submitted}/{reviews.length}
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      {reviews.map((r) => (
                        <div
                          key={r.id}
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: 14,
                            padding: 12,
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ fontWeight: 900 }}>Reviewer {r.reviewerId}</div>
                            <div className="roleBadge role-reviewer">{r.status}</div>
                          </div>

                          <div className="hint" style={{ marginTop: 6 }}>
                            Recommendation: {r.recommendation || "-"} • Score: {r.score ?? "-"}
                          </div>

                          <div style={{ marginTop: 10, whiteSpace: "pre-wrap", color: "var(--muted)" }}>
                            {r.comments || "No comments."}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
