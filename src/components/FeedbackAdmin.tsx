// FEEDBACK-FEATURE: admin view of feedback/support submissions from /feedback.
// Rendered inside the admin page under the "Feedback" tab. The submitter's email
// is shown as a mailto: reply link so the operator can respond directly.
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Trash2, Check, RotateCcw } from "lucide-react";

const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";

interface FeedbackItem {
  id: string;
  email: string;
  category: string;
  message: string;
  resolved: boolean;
  createdAt: string;
  userId: string | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  bug: "Bug", feature: "Feature request", question: "Question", other: "Other", general: "General",
};

export default function FeedbackAdmin() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setLoadFailed(false);
    setForbidden(false);
    let wasForbidden = false;
    fetch("/api/admin/feedback")
      .then(r => {
        if (r.status === 403) { wasForbidden = true; setForbidden(true); throw new Error("forbidden"); }
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then(d => setItems(d.feedback ?? []))
      .catch(() => { if (!wasForbidden) setLoadFailed(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const toggleResolved = async (id: string, resolved: boolean) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved }),
      });
      if (!res.ok) throw new Error("failed");
      setItems(prev => prev.map(f => (f.id === id ? { ...f, resolved } : f)));
    } catch {
      alert("Couldn't update this item - try again.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setItems(prev => prev.filter(f => f.id !== id));
    } catch {
      alert("Couldn't delete this item - try again.");
    } finally {
      setBusyId(null);
      setConfirmDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", fontFamily: FONT }}>
        Loading feedback...
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
        <p style={{ color: "var(--hp-soft-foreground)", fontSize: "0.9rem", marginBottom: "1rem" }}>Couldn&apos;t load feedback.</p>
        <button onClick={load} style={{ height: "38px", padding: "0 1.25rem", borderRadius: "9999px", border: "none", background: "var(--hp-primary)", color: "white", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
          Retry
        </button>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--hp-soft-foreground)", background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", fontFamily: FONT }}>
        No feedback yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontFamily: FONT }}>
      {items.map(f => {
        const busy = busyId === f.id;
        return (
          <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "white", borderRadius: "14px", border: "1px solid var(--hp-border)", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", opacity: f.resolved ? 0.65 : 1 }}>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--hp-primary)", background: "var(--hp-primary-soft)", borderRadius: "9999px", padding: "0.2rem 0.6rem" }}>
                {CATEGORY_LABEL[f.category] ?? f.category}
              </span>
              {f.resolved && (
                <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#15803d" }}>Resolved</span>
              )}
              <div style={{ flex: 1, minWidth: "8px" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--hp-soft-foreground)" }}>
                {new Date(f.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--hp-foreground)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {f.message}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.6rem", borderTop: "1px solid var(--hp-border)" }}>
              <a
                href={`mailto:${f.email}?subject=${encodeURIComponent("Re: your MyCasePrep " + (CATEGORY_LABEL[f.category] ?? "message"))}`}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 600, color: "var(--hp-primary)", textDecoration: "none" }}
              >
                <Mail size={15} /> {f.email}
              </a>
              {!f.userId && <span style={{ fontSize: "0.7rem", color: "var(--hp-soft-foreground)" }}>(not signed in)</span>}

              <div style={{ flex: 1, minWidth: "8px" }} />

              <button
                disabled={busy}
                onClick={() => toggleResolved(f.id, !f.resolved)}
                style={{ height: "32px", padding: "0 0.9rem", borderRadius: "9999px", border: `1.5px solid ${f.resolved ? "var(--hp-border-strong)" : "#15803d"}`, background: "white", color: f.resolved ? "var(--hp-soft-foreground)" : "#15803d", fontSize: "0.78rem", fontWeight: 600, cursor: busy ? "wait" : "pointer", fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: "0.35rem", whiteSpace: "nowrap" }}
              >
                {f.resolved ? <><RotateCcw size={14} /> Reopen</> : <><Check size={14} /> Mark resolved</>}
              </button>

              {confirmDeleteId === f.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: 600, whiteSpace: "nowrap" }}>Delete?</span>
                  <button disabled={busy} onClick={() => remove(f.id)} style={{ height: "32px", padding: "0 0.75rem", borderRadius: "8px", border: "none", background: "#dc2626", color: "white", fontSize: "0.78rem", fontWeight: 700, cursor: busy ? "wait" : "pointer", fontFamily: FONT }}>Confirm</button>
                  <button disabled={busy} onClick={() => setConfirmDeleteId(null)} style={{ height: "32px", padding: "0 0.75rem", borderRadius: "8px", border: "1px solid var(--hp-border-strong)", background: "white", color: "var(--hp-foreground)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
                </div>
              ) : (
                <button
                  disabled={busy}
                  onClick={() => setConfirmDeleteId(f.id)}
                  style={{ height: "32px", width: "32px", borderRadius: "9999px", border: "1px solid #fecaca", background: "white", color: "#dc2626", cursor: busy ? "wait" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
