import { useState } from "react";
import api from "../api";
import { setCurrentUser } from "../authStorage";

export default function Login() {
  const [isNew, setIsNew] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("AUTHOR");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail) return setError("Email is required");

    const payload = { email: cleanEmail };

    if (isNew) {
      const cleanName = name.trim();
      if (!cleanName) return setError("Name is required for new users");
      payload.name = cleanName;
      payload.role = role;
    }

    try {
      const res = await api.post("/auth/login", payload);
      setCurrentUser(res.data);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div>
            <h2 className="title">Conference App</h2>
            <p className="subtitle">Login to access your dashboard</p>
          </div>
          <div className="roleBadge">SPA • REST • ORM</div>
        </div>

        <form className="form" onSubmit={submit}>
          <label className="label">
            Email
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@youremail.com"
            />
          </label>

          <label className="label" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
            I’m new (create account)
          </label>

          {isNew ? (
            <div className="row">
              <label className="label">
                Name
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="your-name" />
              </label>

              <label className="label">
                Role
                <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="AUTHOR">AUTHOR</option>
                  <option value="REVIEWER">REVIEWER</option>
                  <option value="ORGANIZER">ORGANIZER</option>
                </select>
              </label>
            </div>
          ) : null}

          <button className="button" type="submit">
            Login
          </button>

          {error ? <div className="error">{error}</div> : null}
        </form>

        <p className="hint">Existing users: email only. New users: tick “I’m new” and choose a role once.</p>
      </div>
    </div>
  );
}
