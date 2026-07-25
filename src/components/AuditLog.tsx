// AUDIT-LOG: read-only admin activity feed. Rendered under the admin page's
// "Activity" tab. Shows who did what to whom and when.
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ban, ShieldCheck, Trash2, Check, RotateCcw, Coins, Activity as ActivityIcon } from "lucide-react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

interface AuditEntry {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetLabel: string | null;
  detail: string | null;
  createdAt: string;
}

// Per-action presentation: human label + icon + accent color.
const ACTION_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  "user.ban": { label: "Banned user", icon: <Ban size={15} />, color: "#dc2626" },
  "user.unban": { label: "Unbanned user", icon: <ShieldCheck size={15} />, color: "#15803d" },
  "user.grant_unlimited": { label: "Granted unlimited", icon: <ShieldCheck size={15} />, color: "var(--hp-primary)" },
  "user.revoke_unlimited": { label: "Revoked unlimited", icon: <ShieldCheck size={15} />, color: "var(--hp-soft-foreground)" },
  "user.set_bonus": { label: "Set bonus cases", icon: <Coins size={15} />, color: "var(--hp-primary)" },
  "user.delete": { label: "Deleted user", icon: <Trash2 size={15} />, color: "#dc2626" },
  "feedback.resolve": { label: "Resolved feedback", icon: <Check size={15} />, color: "#15803d" },
  "feedback.reopen": { label: "Reopened feedback", icon: <RotateCcw size={15} />, color: "var(--hp-soft-foreground)" },
  "feedback.delete": { label: "Deleted feedback", icon: <Trash2 size={15} />, color: "#dc2626" },
};

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const load = () => {
    setLoading(true);
    setLoadFailed(false);
    setForbidden(false);
    let wasForbidden = false;
    fetch("/api/admin/audit")
      .then(r => {
        if (r.status === 403) { wasForbidden = true; setForbidden(true); throw new Error("forbidden"); }
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then(d => setEntries(d.entries ?? []))
      .catch(() => { if (!wasForbidden) setLoadFailed(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", fontFamily: FONT }}>
        Loading activity...
      </div>
    );
  }
  if (forbidden) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", fontFamily: FONT }}>
        <p style={{ color: "var(--hp-foreground)", fontSize: "0.95rem", fontWeight: 600, margin: "0 0 0.4rem" }}>Not authorized</p>
        <p style={{ color: "var(--hp-soft-foreground)", fontSize: "0.85rem", margin: 0 }}>This page is restricted to administrators.</p>
      </div>
    );
  }
  if (loadFailed) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", fontFamily: FONT }}>
        <p style={{ color: "var(--hp-soft-foreground)", fontSize: "0.9rem", marginBottom: "1rem" }}>Couldn&apos;t load activity.</p>
        <button onClick={load} style={{ height: "38px", padding: "0 1.25rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
          Retry
        </button>
      </div>
    );
  }
  if (entries.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", fontFamily: FONT }}>
        No admin activity recorded yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontFamily: FONT }}>
      {entries.map(e => {
        const meta = ACTION_META[e.action] ?? { label: e.action, icon: <ActivityIcon size={15} />, color: "var(--hp-soft-foreground)" };
        return (
          <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "white", borderRadius: "12px", border: "1px solid var(--hp-border)", padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
            <span style={{ width: "30px", height: "30px", borderRadius: "9999px", background: "var(--hp-primary-soft)", color: meta.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
              {meta.icon}
            </span>
            <div style={{ flex: 1, minWidth: "180px" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--hp-foreground)" }}>
                {meta.label}
                {e.targetLabel && <span style={{ fontWeight: 500, color: "var(--hp-soft-foreground)" }}> · {e.targetLabel}</span>}
                {e.detail && <span style={{ fontWeight: 500, color: "var(--hp-soft-foreground)" }}> ({e.detail})</span>}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)" }}>by {e.adminEmail}</div>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--hp-soft-foreground)", whiteSpace: "nowrap" }}>
              {new Date(e.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
