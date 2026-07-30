"use client";

export type AnalyticsConsent = "granted" | "denied";
export type AnalyticsEventProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

type AmplitudeSdk = typeof import("@amplitude/analytics-browser");

const CONSENT_KEY = "mycaseprep_analytics_consent";
const AUTH_PENDING_KEY = "mycaseprep_auth_pending";
export const ANALYTICS_CONSENT_CHANGED = "mycaseprep:analytics-consent-changed";

let amplitudeSdk: AmplitudeSdk | null = null;
let amplitudeInitialization: Promise<void> | null = null;
let pendingAmplitudeUserId: string | undefined;
let pendingAmplitudeEvents: {
  name: string;
  properties: Record<string, string | number | boolean | null>;
}[] = [];

function cleanProperties(properties: AnalyticsEventProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean | null>;
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Analytics remains off if storage is unavailable.
  }
  window.dispatchEvent(
    new CustomEvent<AnalyticsConsent>(ANALYTICS_CONSENT_CHANGED, {
      detail: consent,
    }),
  );
}

export async function initializeAmplitude(
  apiKey: string,
  userId?: string,
): Promise<void> {
  pendingAmplitudeUserId = userId;

  if (amplitudeSdk) {
    amplitudeSdk.setOptOut(false);
    amplitudeSdk.setUserId(userId);
    return;
  }

  if (!amplitudeInitialization) {
    amplitudeInitialization = import("@amplitude/analytics-browser")
      .then(async (sdk) => {
        await sdk.init(apiKey, pendingAmplitudeUserId, {
          // Explicit events keep answer text, form values, and DOM content out
          // of analytics. GA4 handles acquisition; Amplitude handles product use.
          autocapture: false,
        }).promise;
        amplitudeSdk = sdk;
        sdk.setOptOut(false);
        sdk.setUserId(pendingAmplitudeUserId);

        const queued = pendingAmplitudeEvents;
        pendingAmplitudeEvents = [];
        queued.forEach(({ name, properties }) => sdk.track(name, properties));
      })
      .catch((error) => {
        amplitudeInitialization = null;
        if (process.env.NODE_ENV === "development") {
          console.error("Amplitude failed to initialize", error);
        }
      });
  }

  await amplitudeInitialization;
}

export function initializeGoogleAnalytics(measurementId: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer.push(args);
    });

  window[`ga-disable-${measurementId}`] = false;
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export function setAnalyticsUser(userId: string | null) {
  pendingAmplitudeUserId = userId ?? undefined;
  amplitudeSdk?.setUserId(pendingAmplitudeUserId);
  window.gtag?.("set", { user_id: userId });
}

export function optOutOfAnalytics(measurementId?: string) {
  amplitudeSdk?.setOptOut(true);
  pendingAmplitudeEvents = [];

  if (measurementId && typeof window !== "undefined") {
    window[`ga-disable-${measurementId}`] = true;
  }
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
}

export function trackEvent(
  name: string,
  properties: AnalyticsEventProperties = {},
) {
  if (typeof window === "undefined" || getAnalyticsConsent() !== "granted") {
    return;
  }

  const cleaned = cleanProperties(properties);
  window.gtag?.("event", name, cleaned);

  if (amplitudeSdk) {
    amplitudeSdk.track(name, cleaned);
  } else {
    pendingAmplitudeEvents.push({ name, properties: cleaned });
  }
}

export function markPendingAuth(
  event: "login" | "sign_up",
  method: "email" | "google",
) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      AUTH_PENDING_KEY,
      JSON.stringify({ event, method, createdAt: Date.now() }),
    );
  } catch {
    // Authentication should never depend on analytics storage.
  }
}

export function consumePendingAuth(): {
  event: "login" | "sign_up";
  method: "email" | "google";
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(AUTH_PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      event?: string;
      method?: string;
      createdAt?: number;
    };
    const validEvent = parsed.event === "login" || parsed.event === "sign_up";
    const validMethod = parsed.method === "email" || parsed.method === "google";
    const fresh =
      typeof parsed.createdAt === "number" &&
      Date.now() - parsed.createdAt < 10 * 60 * 1000;

    if (!validEvent || !validMethod || !fresh) {
      window.sessionStorage.removeItem(AUTH_PENDING_KEY);
      return null;
    }

    window.sessionStorage.removeItem(AUTH_PENDING_KEY);
    return {
      event: parsed.event as "login" | "sign_up",
      method: parsed.method as "email" | "google",
    };
  } catch {
    return null;
  }
}
