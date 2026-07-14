"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Users, Search, ShieldCheck, Ban } from "lucide-react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  unlimitedCases: boolean;
  bonusCases: number;
  banned: boolean;
  sessionCount: number;
  avgScore: number | null;
  lastActive: string | null;
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--hp-soft-foreground)" }}>
        <span style={{ color: "var(--hp-primary)" }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--hp-foreground)", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [bonusDrafts, setBonusDrafts] = useState<Record<string, string>>({});

  const loadUsers = () => {
    setLoading(true);
    setLoadFailed(false);
    fetch("/api/admin/users")
      .then(r => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then(d => setUsers(d.users ?? []))
      .catch(() => setLoadFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  const patchUser = async (id: string, data: Partial<Pick<AdminUser, "unlimitedCases" | "bonusCases" | "banned">>) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      const updated = await res.json();
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updated } : u)));
    } catch {
      alert("Couldn't update this user - try again.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      alert("Couldn't delete this user - try again.");
    } finally {
      setBusyId(null);
      setConfirmDeleteId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q));
  }, [users, search]);

  const totalUsers = users.length;
  const unlimitedCount = users.filter(u => u.unlimitedCases).length;
  const bannedCount = users.filter(u => u.banned).length;
  const scored = users.filter(u => u.avgScore != null);
  const avgScoreAll = scored.length > 0 ? Math.round(scored.reduce((a, u) => a + (u.avgScore ?? 0), 0) / scored.length) : null;

  return (
    <div style={{ minHeight: "100vh", background: "oklch(0.985 0.005 285)", fontFamily: FONT }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--hp-foreground)", margin: 0 }}>
            Admin
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.9rem", color: "var(--hp-soft-foreground)" }}>
            Manage users and case allowances
          </p>
        </motion.div>

        {!loading && !loadFailed && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.875rem", marginBottom: "1.5rem" }}>
            <StatTile icon={<Users size={16} />} label="Total users" value={totalUsers} />
            <StatTile icon={<ShieldCheck size={16} />} label="Unlimited grants" value={unlimitedCount} />
            <StatTile icon={<Ban size={16} />} label="Banned" value={bannedCount} />
            <StatTile icon={<Users size={16} />} label="Avg score (all)" value={avgScoreAll ?? " - "} />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ marginBottom: "1.25rem", position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--hp-soft-foreground)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ width: "100%", height: "42px", paddingLeft: "2.4rem", paddingRight: "1rem", borderRadius: "10px", border: "1px solid var(--hp-border)", background: "white", fontSize: "0.85rem", fontFamily: FONT, outline: "none", boxSizing: "border-box" }}
          />
        </motion.div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)" }}>
            Loading users...
          </div>
        ) : loadFailed ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)" }}>
            <p style={{ color: "var(--hp-soft-foreground)", fontSize: "0.9rem", marginBottom: "1rem" }}>Couldn&apos;t load users.</p>
            <button onClick={loadUsers} style={{ height: "38px", padding: "0 1.25rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)" }}>
            No users match your search
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {filtered.map(u => {
              const busy = busyId === u.id;
              const bonusDraft = bonusDrafts[u.id] ?? String(u.bonusCases);
              return (
                <motion.div key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: "white", borderRadius: "14px", border: `1px solid ${u.banned ? "#fecaca" : "var(--hp-border)"}`, padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexWrap: "wrap" }}>
                    {u.image ? (
                      <img src={u.image} alt="" style={{ width: "38px", height: "38px", borderRadius: "9999px", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: "38px", height: "38px", borderRadius: "9999px", background: "var(--hp-primary-soft)", display: "grid", placeItems: "center", fontSize: "0.85rem", fontWeight: 700, color: "var(--hp-primary)", flexShrink: 0 }}>
                        {(u.name ?? u.email ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: "160px" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--hp-foreground)" }}>
                        {u.name ?? "Unnamed"} {u.banned && <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#dc2626", marginLeft: "0.4rem" }}>BANNED</span>}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--hp-soft-foreground)" }}>{u.email ?? " - "}</div>
                    </div>

                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--hp-foreground)" }}>{u.sessionCount}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--hp-soft-foreground)" }}>sessions</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--hp-foreground)" }}>{u.avgScore ?? " - "}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--hp-soft-foreground)" }}>avg score</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--hp-soft-foreground)" }}>
                          {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--hp-soft-foreground)" }}>joined</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.6rem", borderTop: "1px solid var(--hp-border)" }}>
                    <button
                      disabled={busy}
                      onClick={() => patchUser(u.id, { unlimitedCases: !u.unlimitedCases })}
                      style={{
                        height: "32px", padding: "0 0.9rem", borderRadius: "9999px",
                        border: `1.5px solid ${u.unlimitedCases ? "var(--hp-primary)" : "var(--hp-border)"}`,
                        background: u.unlimitedCases ? "var(--hp-primary)" : "white",
                        color: u.unlimitedCases ? "white" : "var(--hp-soft-foreground)",
                        fontSize: "0.78rem", fontWeight: 600, cursor: busy ? "wait" : "pointer", fontFamily: FONT,
                        flexShrink: 0, whiteSpace: "nowrap",
                      }}
                    >
                      {u.unlimitedCases ? "Unlimited ✓" : "Grant unlimited"}
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                      <input
                        type="number"
                        min={0}
                        value={bonusDraft}
                        onChange={e => setBonusDrafts(prev => ({ ...prev, [u.id]: e.target.value }))}
                        style={{ width: "60px", height: "32px", padding: "0 0.5rem", borderRadius: "8px", border: "1px solid var(--hp-border)", fontSize: "0.8rem", fontFamily: FONT, flexShrink: 0 }}
                      />
                      <button
                        disabled={busy}
                        onClick={() => patchUser(u.id, { bonusCases: parseInt(bonusDraft, 10) || 0 })}
                        style={{ height: "32px", padding: "0 0.75rem", borderRadius: "8px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "0.78rem", fontWeight: 600, cursor: busy ? "wait" : "pointer", fontFamily: FONT, flexShrink: 0, whiteSpace: "nowrap" }}
                      >
                        Set bonus cases
                      </button>
                    </div>

                    <div style={{ flex: 1, minWidth: "8px" }} />

                    <button
                      disabled={busy}
                      onClick={() => patchUser(u.id, { banned: !u.banned })}
                      style={{ height: "32px", padding: "0 0.9rem", borderRadius: "9999px", border: `1.5px solid ${u.banned ? "#15803d" : "#fecaca"}`, background: "white", color: u.banned ? "#15803d" : "#dc2626", fontSize: "0.78rem", fontWeight: 600, cursor: busy ? "wait" : "pointer", fontFamily: FONT, flexShrink: 0, whiteSpace: "nowrap" }}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>

                    {confirmDeleteId === u.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: 600, whiteSpace: "nowrap" }}>Delete permanently?</span>
                        <button disabled={busy} onClick={() => deleteUser(u.id)} style={{ height: "32px", padding: "0 0.75rem", borderRadius: "8px", border: "none", background: "#dc2626", color: "white", fontSize: "0.78rem", fontWeight: 700, cursor: busy ? "wait" : "pointer", fontFamily: FONT, flexShrink: 0, whiteSpace: "nowrap" }}>
                          Confirm
                        </button>
                        <button disabled={busy} onClick={() => setConfirmDeleteId(null)} style={{ height: "32px", padding: "0 0.75rem", borderRadius: "8px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT, flexShrink: 0, whiteSpace: "nowrap" }}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={busy}
                        onClick={() => setConfirmDeleteId(u.id)}
                        style={{ height: "32px", padding: "0 0.9rem", borderRadius: "9999px", border: "1px solid #fecaca", background: "white", color: "#dc2626", fontSize: "0.78rem", fontWeight: 600, cursor: busy ? "wait" : "pointer", fontFamily: FONT, flexShrink: 0, whiteSpace: "nowrap" }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
