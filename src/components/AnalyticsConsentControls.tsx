"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_CHANGED,
  AnalyticsConsent,
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/analytics";

export default function AnalyticsConsentControls() {
  const [consent, setConsentState] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    setConsentState(getAnalyticsConsent());
    const handleConsent = (event: Event) => {
      setConsentState((event as CustomEvent<AnalyticsConsent>).detail);
    };
    window.addEventListener(ANALYTICS_CONSENT_CHANGED, handleConsent);
    return () =>
      window.removeEventListener(ANALYTICS_CONSENT_CHANGED, handleConsent);
  }, []);

  const enabled = consent === "granted";

  return (
    <div
      id="analytics-privacy"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 320px" }}>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--hp-foreground)",
          }}
        >
          Privacy-conscious product analytics
        </div>
        <div
          style={{
            fontSize: "0.78rem",
            color: "var(--hp-soft-foreground)",
            lineHeight: 1.6,
            marginTop: "0.25rem",
          }}
        >
          Share page visits and practice milestones with Amplitude and Google
          Analytics. Names, emails, prompts, answers, and transcripts are never
          included. You can change this at any time.
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setAnalyticsConsent(enabled ? "denied" : "granted")}
        style={{
          minWidth: "116px",
          height: "38px",
          padding: "0 0.9rem",
          borderRadius: "9999px",
          border: `1px solid ${
            enabled ? "var(--hp-primary)" : "var(--hp-border-strong)"
          }`,
          background: enabled ? "var(--hp-primary-soft)" : "white",
          color: enabled
            ? "var(--hp-primary)"
            : "var(--hp-soft-foreground)",
          fontFamily:
            "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
          fontSize: "0.8rem",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Analytics {enabled ? "on" : "off"}
      </button>
    </div>
  );
}
