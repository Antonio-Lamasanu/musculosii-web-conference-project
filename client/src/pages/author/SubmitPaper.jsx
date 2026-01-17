import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function SubmitPaper() {
  const navigate = useNavigate();

  const [conferences, setConferences] = useState([]);
  const [conferenceId, setConferenceId] = useState("");

  const [title, setTitle] = useState("");
  const [abstractText, setAbstractText] = useState("");
  const [content, setContent] = useState("");

  const [fileUrl, setFileUrl] = useState("");

  const [error, setError] = useState("");
  const [loadingConfs, setLoadingConfs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const openConfs = useMemo(() => {
    return (Array.isArray(conferences) ? conferences : []).filter((c) => c?.status === "OPEN");
  }, [conferences]);

  async function loadConfs() {
    setLoadingConfs(true);
    setError("");
    try {
      const res = await api.get("/conferences");
      const list = Array.isArray(res.data) ? res.data : [];
      setConferences(list);
      if (!Array.isArray(res.data)) setError(res.data?.error || "Unexpected response from server");
    } catch (err) {
      setConferences([]);
      setError(err.response?.data?.error || "Failed to load conferences");
    } finally {
      setLoadingConfs(false);
    }
  }

  useEffect(() => {
    loadConfs();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      conferenceId: Number(conferenceId),
      title: title.trim(),
      abstract: abstractText.trim(),
      content: content.trim(),
      fileUrl: fileUrl.trim() ? fileUrl.trim() : null,
    };

    if (!payload.conferenceId) return setError("Conference is required");
    if (!payload.title) return setError("Title is required");
    if (!payload.abstract) return setError("Abstract is required");
    if (!payload.content) return setError("Paper content is required");

    setSubmitting(true);
    try {
      await api.post("/papers", payload);
      navigate("/author/papers");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit paper");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <h3 style={{ marginTop: 0 }}>Submit Paper</h3>
        <button className="button logout" onClick={loadConfs} disabled={loadingConfs}>
          Refresh conferences
        </button>
      </div>

      {loadingConfs ? <p className="hint">Loading conferences...</p> : null}
      {error ? <div className="error">{error}</div> : null}

      <form className="form" onSubmit={submit}>
        <label className="label">
          Conference
          <select
            className="select"
            value={conferenceId}
            onChange={(e) => setConferenceId(e.target.value)}
            disabled={loadingConfs || submitting}
          >
            <option value="">Select an OPEN conference...</option>
            {openConfs.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.id} — {c.title} ({c.startDate} → {c.endDate})
              </option>
            ))}
          </select>
        </label>

        <label className="label">
          Title
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} disabled={submitting} />
        </label>

        <label className="label">
          Abstract
          <textarea
            className="textarea"
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
            disabled={submitting}
          />
        </label>

        <label className="label">
          Paper content
          <textarea
            className="textarea"
            style={{ minHeight: 220 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
          />
        </label>

        <label className="label">
          File URL (optional mock)
          <input
            className="input"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://..."
            disabled={submitting}
          />
        </label>

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <p className="hint">
        The paper text is stored in the database for the MVP. The File URL is optional and acts as a mock for external storage.
        Auto-assignment happens when the paper is submitted (requires at least 2 reviewers in the pool).
      </p>
    </div>
  );
}
