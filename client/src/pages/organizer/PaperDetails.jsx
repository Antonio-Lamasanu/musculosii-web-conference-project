import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";

function clampText(text, max = 1600) {
  const s = String(text || "");
  if (s.length <= max) return s;
  return s.slice(0, max) + "…";
}

export default function PaperDetails() {
  const { id } = useParams();
  const paperId = Number(id);

  const [paper, setPaper] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/papers/${paperId}`);
      setPaper(res.data);
    } catch (err) {
      setPaper(null);
      setError(err.response?.data?.error || "Failed to load paper details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [paperId]);

  if (loading) return <p className="hint">Loading...</p>;
  if (error) return <div className="error">{error}</div>;
  if (!paper) return <div className="error">Paper not found</div>;

  const reviews = Array.isArray(paper.reviews) ? paper.reviews : [];
  const submitted = reviews.filter((r) => r.status === "SUBMITTED").length;

  const abstractText = showFull ? paper.abstract : clampText(paper.abstract, 700);
  const contentText = showFull ? paper.content : clampText(paper.content, 2200);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h3 style={{ marginTop: 0 }}>Submission Details</h3>

        <Link className="roleBadge role-organizer" to="/organizer/submissions">
          Back
        </Link>
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 14,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <div style={{ fontWeight: 900 }}>{paper.title}</div>
          <div className="roleBadge role-organizer">{paper.status}</div>
        </div>

        <div className="hint" style={{ marginTop: 6 }}>
          Paper #{paper.id} • Conference {paper.conferenceId} • Author {paper.authorId} • Version {paper.version}
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {paper.fileUrl ? (
            <a className="roleBadge" href={paper.fileUrl} target="_blank" rel="noreferrer">
              Open file (mock)
            </a>
          ) : null}

          <button className="roleBadge" onClick={load}>
            Refresh
          </button>

          <button className="roleBadge" onClick={() => setShowFull((v) => !v)}>
            {showFull ? "Show less" : "Show full text"}
          </button>
        </div>
      </div>

      <div className="sectionTitle">Author writing</div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 14,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="hint" style={{ marginTop: 0 }}>
          Abstract
        </div>
        <div style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "var(--muted)" }}>
          {paper.abstract ? abstractText : "—"}
        </div>

        <div className="hint" style={{ marginTop: 14 }}>
          Content
        </div>
        <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
          {paper.content ? contentText : "—"}
        </div>
      </div>

      <div className="sectionTitle">Reviews</div>

      <div className="hint" style={{ marginTop: -6, marginBottom: 10 }}>
        Submitted: {submitted}/{reviews.length}
      </div>

      {reviews.length === 0 ? (
        <p className="hint">No reviews yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 14,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
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
      )}
    </div>
  );
}
