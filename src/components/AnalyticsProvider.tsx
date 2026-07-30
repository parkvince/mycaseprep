"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  ANALYTICS_CONSENT_CHANGED,
  AnalyticsConsent,
  consumePendingAuth,
  getAnalyticsConsent,
  initializeAmplitude,
  initializeGoogleAnalytics,
  optOutOfAnalytics,
  setAnalyticsConsent,
  setAnalyticsUser,
  trackEvent,
} from "@/lib/analytics";

const configuredGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const configuredAmplitudeKey =
  process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY?.trim();

// Public analytics identifiers are optional. Treat template placeholders or
// malformed values as missing so local setup never produces noisy failed
// requests while only one provider is configured.
const GA_MEASUREMENT_ID =
  configuredGaId && /^G-[A-Z0-9]+$/i.test(configuredGaId)
    ? configuredGaId
    : undefined;
const AMPLITUDE_API_KEY =
  configuredAmplitudeKey &&
  configuredAmplitudeKey !== "your-amplitude-api-key" &&
  /^[a-f0-9]{20,}$/i.test(configuredAmplitudeKey)
    ? configuredAmplitudeKey
    : undefined;
const ANALYTICS_CONFIGURED = Boolean(GA_MEASUREMENT_ID || AMPLITUDE_API_KEY);

function pageGroup(pathname: string) {
  if (pathname.startsWith("/case/")) return "case";
  if (pathname.startsWith("/guide/")) return "firm_guide";
  if (pathname === "/guide") return "guide";
  if (pathname === "/") return "home";
  return pathname.split("/").filter(Boolean)[0] || "home";
}

function safePageTitle(pathname: string) {
  const group = pageGroup(pathname);
  const titles: Record<string, string> = {
    home: "Home",
    auth: "Authentication",
    dashboard: "Case setup",
    library: "Case library",
    case: "Case practice",
    history: "Practice history",
    settings: "Settings",
    feedback: "Feedback",
    guide: "Interview guide",
    firm_guide: "Firm guide",
    admin: "Admin",
    banned: "Account unavailable",
  };
  return titles[group] ?? "MyCasePrep";
}

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [consent, setConsentState] = useState<AnalyticsConsent | null>(null);
  const lastPageRef = useRef<string | null>(null);

  useEffect(() => {
    setConsentState(getAnalyticsConsent());

    const handleConsent = (event: Event) => {
      setConsentState((event as CustomEvent<AnalyticsConsent>).detail);
    };
    window.addEventListener(ANALYTICS_CONSENT_CHANGED, handleConsent);
    return () =>
      window.removeEventListener(ANALYTICS_CONSENT_CHANGED, handleConsent);
  }, []);

  useEffect(() => {
    if (!ANALYTICS_CONFIGURED || consent !== "granted") {
      lastPageRef.current = null;
      if (consent === "denied") optOutOfAnalytics(GA_MEASUREMENT_ID);
      return;
    }

    if (GA_MEASUREMENT_ID) initializeGoogleAnalytics(GA_MEASUREMENT_ID);
    if (AMPLITUDE_API_KEY) {
      void initializeAmplitude(AMPLITUDE_API_KEY, session?.user?.id);
    }
  }, [consent, session?.user?.id]);

  useEffect(() => {
    if (consent !== "granted" || status === "loading") return;
    setAnalyticsUser(status === "authenticated" ? session.user.id : null);

    if (status === "authenticated") {
      const pendingAuth = consumePendingAuth();
      if (pendingAuth) {
        trackEvent(pendingAuth.event, { method: pendingAuth.method });
      }
    }
  }, [consent, session?.user?.id, status]);

  useEffect(() => {
    if (
      consent !== "granted" ||
      status === "loading" ||
      lastPageRef.current === pathname
    ) {
      return;
    }
    lastPageRef.current = pathname;
    trackEvent("page_view", {
      page_path: pathname,
      page_group: pageGroup(pathname),
      page_title: safePageTitle(pathname),
    });
  }, [consent, pathname, status]);

  return (
    <>
      {children}

      {consent === "granted" && GA_MEASUREMENT_ID && (
        <Script
          id="google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      )}

      {ANALYTICS_CONFIGURED && consent === null && (
        <aside
          aria-label="Analytics preference"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "1rem",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "min(680px, calc(100vw - 2rem))",
            boxSizing: "border-box",
            padding: "1rem 1.1rem",
            borderRadius: "16px",
            border: "1px solid var(--hp-border-strong)",
            background: "white",
            boxShadow: "0 16px 50px rgba(38, 30, 70, 0.18)",
            fontFamily:
              "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 360px" }}>
            <div
              style={{
                color: "var(--hp-foreground)",
                fontSize: "0.88rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
              }}
            >
              Help us improve MyCasePrep
            </div>
            <div
              style={{
                color: "var(--hp-soft-foreground)",
                fontSize: "0.76rem",
                lineHeight: 1.55,
              }}
            >
              With your permission, Amplitude and Google Analytics tell us which
              features help people return. We never send names, emails, prompts,
              answers, or transcripts.
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setAnalyticsConsent("denied")}
              style={{
                height: "38px",
                padding: "0 0.9rem",
                borderRadius: "9999px",
                border: "1px solid var(--hp-border-strong)",
                background: "white",
                color: "var(--hp-foreground)",
                font: "inherit",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              No thanks
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsConsent("granted")}
              style={{
                height: "38px",
                padding: "0 1rem",
                borderRadius: "9999px",
                border: "none",
                background: "var(--hp-primary)",
                color: "white",
                font: "inherit",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Allow analytics
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
