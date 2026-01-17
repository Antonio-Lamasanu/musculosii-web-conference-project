import { useEffect, useMemo, useState } from "react";
import api from "../../api";

function clampText(text, max = 800) {
  const s = String(text || "");
  if (s.length <= max) return s;
  return s.slice(0, max) + "…";
}

export default function AssignedPapers() {
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [openId, setOpenId] = useState(null);
  const [showFullText, setShowFullText] = useState(false);

  const [recommendation, setRecommendation] = useState("");
  const [score, setScore] = useState("");
  const [comments, setComments] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/papers/assigned");
      if (!Array.isArray(res.data)) {
        setPapers([]);
        setError(res.data?.error || "Unexpected response from server");
        return;
      }
      setPapers(res.data);
    } catch (err) {
      setPapers([]);
      setError(err.response?.data?.error || "Failed to load assigned papers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openForm(paperId) {
    setOpenId(paperId);
    setShowFullText(false);
    setRecommendation("");
    setScore("");
    setComments("");
    setSubmitError("");
  }

  function closeForm() {
    setOpenId(null);
    setShowFullText(false);
    setRecommendation("");
    setScore("");
    setComments("");
    setSubmitError("");
  }

  const openPaper = useMemo(() => papers.find((p) => p.id === openId) || null, [papers, openId]);

  async function submit(paperId) {
    setSubmitError("");

    const rec = String(recommendation || "").trim().toUpperCase();
    if (!rec) return setSubmitError("Recommendation is required");

    let scoreValue = null;
    const s = String(score || "").trim();
    if (s !== "") {
      const n = Number(s);
      if (!Number.isFinite(n)) return setSubmitError("Score must be a number");
      scoreValue = n;
    }

    setSubmitting(true);
    try {
      await api.post(`/papers/${paperId}/reviews`, {
        recommendation: rec,
        score: scoreValue,
        comments: String(comments || "").trim() ? String(comments).trim() : null,
      });

      closeForm();
      await load();
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <h3 style={{ marginTop: 0 }}>Assigned Papers</h3>
        <button className="button logout" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading ? <p className="hint">Loading...</p> : null}
      {error ? <div className="error">{error}</div> : null}

      {!loading && !error && papers.length === 0 ? (
        <p className="hint">No assigned papers yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {papers.map((p) => (
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
                <div className="roleBadge role-reviewer">{p.status}</div>
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

                {openId === p.id ? (
                  <button className="roleBadge" onClick={closeForm} disabled={submitting}>
                    Close
                  </button>
                ) : (
                  <button className="roleBadge role-reviewer" onClick={() => openForm(p.id)}>
                    Review this paper
                  </button>
                )}
              </div>

              {openId === p.id ? (
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: 12,
                      background: "rgba(255,255,255,0.02)",
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: 6 }}>Paper text</div>

                    <div className="hint" style={{ marginTop: 0 }}>
                      Abstract
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", color: "var(--muted)", marginTop: 6 }}>
                      {openPaper?.abstract ? (showFullText ? openPaper.abstract : clampText(openPaper.abstract, 500)) : "—"}
                    </div>

                    <div className="hint" style={{ marginTop: 12 }}>
                      Content
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", color: "var(--text)", marginTop: 6 }}>
                      {openPaper?.content
                        ? showFullText
                          ? openPaper.content
                          : clampText(openPaper.content, 1200)
                        : "—"}
                    </div>

                    <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button className="roleBadge" type="button" onClick={() => setShowFullText((v) => !v)}>
                        {showFullText ? "Show less" : "Show full text"}
                      </button>
                    </div>
                  </div>

                  <div className="form" style={{ marginTop: 0 }}>
                    <label className="label">
                      Recommendation
                      <select
                        className="select"
                        value={recommendation}
                        onChange={(e) => setRecommendation(e.target.value)}
                        disabled={submitting}
                      >
                        <option value="">Select...</option>
                        <option value="ACCEPT">ACCEPT</option>
                        <option value="REJECT">REJECT</option>
                        <option value="REVISION">REVISION</option>
                      </select>
                    </label>

                    <label className="label">
                      Score (optional)
                      <input
                        className="input"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="e.g. 8"
                        disabled={submitting}
                      />
                    </label>

                    <label className="label">
                      Comments (optional)
                      <textarea
                        className="input"
                        style={{ minHeight: 120, resize: "vertical" }}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        disabled={submitting}
                      />
                    </label>

                    <button className="button" type="button" onClick={() => submit(p.id)} disabled={submitting}>
                      {submitting ? "Submitting..." : "Send review"}
                    </button>

                    {submitError ? <div className="error">{submitError}</div> : null}
                  </div>

                  <p className="hint" style={{ marginBottom: 0 }}>
                    After both reviewers submit, the paper status updates automatically.
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
