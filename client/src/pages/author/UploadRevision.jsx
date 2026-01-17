import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function UploadRevision() {
  const { id } = useParams();
  const paperId = Number(id);
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/papers/${paperId}`);
        setPaper(res.data);
        setContent(String(res.data?.content || ""));
        setFileUrl(String(res.data?.fileUrl || ""));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load paper");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [paperId]);

  async function submit(e) {
    e.preventDefault();
    setError("");

    const cleanContent = String(content || "").trim();
    const cleanUrl = String(fileUrl || "").trim();

    if (!cleanContent && !cleanUrl) return setError("Content or File URL is required");

    setSaving(true);
    try {
      await api.patch(`/papers/${paperId}/revision`, {
        content: cleanContent ? cleanContent : null,
        fileUrl: cleanUrl ? cleanUrl : null,
      });
      navigate("/author/papers");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload revision");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="hint">Loading...</p>;
  if (error) return <div className="error">{error}</div>;
  if (!paper) return <div className="error">Paper not found</div>;

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Upload Revision</h3>
      <p className="hint">
        {paper.title} • current version {paper.version} • status {paper.status}
      </p>

      <form className="form" onSubmit={submit}>
        <label className="label">
          Updated paper content
          <textarea
            className="textarea"
            style={{ minHeight: 240 }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={saving}
          />
        </label>

        <label className="label">
          File URL (optional mock)
          <input
            className="input"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://..."
            disabled={saving}
          />
        </label>

        <button className="button" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save revision"}
        </button>

        {error ? <div className="error">{error}</div> : null}
      </form>
    </div>
  );
}
