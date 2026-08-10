"use client";

import { FormEvent, useMemo, useState } from "react";
import type { WaitlistEntry } from "@/lib/db";

type AdminDashboardProps = {
  initialAuthenticated: boolean;
  initialEntries: WaitlistEntry[];
  initialCount: number;
};

function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function AdminDashboard({
  initialAuthenticated,
  initialEntries,
  initialCount,
}: AdminDashboardProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [entries, setEntries] = useState(initialEntries);
  const [count, setCount] = useState(initialCount);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (entry) =>
        entry.email.toLowerCase().includes(q) ||
        (entry.name || "").toLowerCase().includes(q),
    );
  }, [entries, query]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      setAuthenticated(true);
      setUsername("");
      setPassword("");
      await refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    const response = await fetch("/api/admin/waitlist");
    if (!response.ok) {
      setAuthenticated(false);
      return;
    }
    const data = await response.json();
    setEntries(data.entries || []);
    setCount(data.count || 0);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setEntries([]);
    setCount(0);
  }

  function exportCsv() {
    const header = ["id", "email", "name", "created_at", "user_agent", "referrer"];
    const rows = entries.map((entry) =>
      [
        entry.id,
        entry.email,
        entry.name || "",
        entry.created_at,
        entry.user_agent || "",
        entry.referrer || "",
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...rows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wodoo-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!authenticated) {
    return (
      <div className="admin-shell">
        <div className="admin-card">
          <div className="admin-header">
            <div>
              <h1>Wodoo Admin</h1>
              <p>Sign in to view waitlist requesters.</p>
            </div>
          </div>
          <form className="login-form" onSubmit={login}>
            <label className="sr-only" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <div className="admin-header">
          <div>
            <h1>Waitlist requesters</h1>
            <p>Everyone who joined the Wodoo waitlist.</p>
          </div>
          <div className="admin-actions">
            <button type="button" className="ghost" onClick={() => refresh()}>
              Refresh
            </button>
            <button type="button" className="ghost" onClick={exportCsv}>
              Export CSV
            </button>
            <button type="button" onClick={logout}>
              Log out
            </button>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span>Total signups</span>
            <strong>{count}</strong>
          </div>
          <div className="stat">
            <span>Showing</span>
            <strong>{filtered.length}</strong>
          </div>
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Search by email or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />

        {filtered.length === 0 ? (
          <p className="empty">No waitlist entries yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Joined</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <div>{entry.email}</div>
                      <div className="muted">#{entry.id}</div>
                    </td>
                    <td>{entry.name || "—"}</td>
                    <td>{formatDate(entry.created_at)}</td>
                    <td>
                      <div className="muted">
                        {entry.referrer || "Direct"}
                      </div>
                      <div className="muted">
                        {(entry.user_agent || "").slice(0, 72) || "—"}
                        {(entry.user_agent || "").length > 72 ? "…" : ""}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
