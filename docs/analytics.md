# MyCasePrep analytics

MyCasePrep sends the same small, intentional event vocabulary to Google
Analytics 4 and Amplitude. Collection starts only after a visitor chooses
**Allow analytics**. The choice can be changed later in
**Settings > Analytics & privacy**.

## 1. Provider setup

### Google Analytics 4

1. Create a Google Analytics account and GA4 property.
2. In **Admin > Data collection and modification > Data streams**, create a Web
   stream for the production domain.
3. Copy its Measurement ID, which starts with `G-`.
4. Under the Web stream's **Enhanced measurement** settings, open advanced
   page-view settings and turn off **Page changes based on browser history
   events**. MyCasePrep sends App Router page views itself, so leaving both on
   would double-count client-side navigation.
5. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local` and in the Vercel project.

### Amplitude

1. Create an Amplitude organization and project.
2. Open the project settings and copy the project API key.
3. Set `NEXT_PUBLIC_AMPLITUDE_API_KEY` in `.env.local` and in the Vercel project.

Use `.env.example` as the template:

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_AMPLITUDE_API_KEY="your-amplitude-api-key"
```

Add these lines to the existing `.env.local`; do not replace the file because it
already contains the app's other local configuration.

These browser identifiers are public by design; they authorize event ingestion,
not access to either dashboard. Production values should still be managed in the
deployment environment. Because `NEXT_PUBLIC_` values are included at build
time, restart local development after changing them and redeploy production
after adding them in Vercel.

If neither variable is present, analytics stays disabled and the consent prompt
does not appear. If only one is present, that provider works independently.

## 2. Verify the installation

1. Run `npm.cmd run dev` on Windows.
2. Open the local site in a private browser window.
3. Choose **Allow analytics**.
4. Visit the library, start a case, and complete it.
5. In Amplitude, use the live event stream or User Lookup and confirm
   `page_view`, `case_started`, and `case_completed`.
6. In GA4, open **Reports > Realtime** and confirm the same events. Realtime can
   take a few minutes; standard reports and new custom definitions can take
   24-48 hours.
7. Repeat once while signed in. The event payload must contain only the internal
   account ID as the provider user ID. It must not contain a name, email,
   prompt, answer, transcript, or generated case title.

Do this once against production after deployment as well. Local success proves
the code path, while production verification proves the deployed environment
variables are set.

## 3. Event dictionary

| Event | When it fires | Useful properties |
| --- | --- | --- |
| `page_view` | Initial page and App Router navigation | `page_path`, `page_group`, `page_title` |
| `sign_up` | Successful email signup or completed Google signup intent | `method` |
| `login` | Successful email login or completed Google login intent | `method` |
| `case_started` | A generated AI case opens or a guided case begins | `case_source`, `firm`, `case_type`, `difficulty`, `practice_mode`, `interviewer_style` |
| `case_completed` | The user ends an AI case or submits a guided case | case attributes plus `duration_seconds`, `hints_used`, `user_responses`, `score`, or `decisions` when applicable |
| `case_evaluated` | AI feedback is successfully generated | case attributes plus `duration_seconds`, `hints_used`, `score` |

Do not add raw database session IDs, timestamps, generated titles, free-form
text, or user contact data as event properties. They create privacy and
high-cardinality problems without improving product decisions.

## 4. Recommended Amplitude charts

### Weekly practice retention

- Chart: **Retention Analysis**
- Starting event: `case_completed`
- Return event: `case_completed`
- Interval: Weekly
- Measure: **Return on or after**
- Compare by: `practice_mode`, then separately by `difficulty`

This answers: “Of people who completed useful practice, how many completed
another case in later weeks?”

### New-user activation funnel

- Chart: **Funnel Analysis**
- Steps: `sign_up` -> `case_started` -> `case_completed` -> `case_evaluated`
- Conversion window: 7 days
- Breakdown: `method`, then separately by `practice_mode`

Google OAuth can create or sign in to an account through the same provider
callback, so `sign_up` versus `login` reflects the tab the visitor chose. Treat
the case milestones as the authoritative activation signals.

### Habit frequency

- Chart: **Event Segmentation**
- Event: `case_completed`
- Metric: Unique users and average events per user
- Interval: Weekly
- Breakdown: `case_source`

Save the three charts to one **Product health** dashboard. Review them weekly,
but wait for several complete cohorts before interpreting a retention curve.

## 5. Recommended GA4 configuration

In **Admin > Data display > Events**, mark these as key events:

- `sign_up`
- `case_completed`

In **Admin > Data display > Custom definitions**, add event-scoped custom
dimensions for:

- `case_source`
- `firm`
- `case_type`
- `difficulty`
- `practice_mode`
- `interviewer_style`

Add event-scoped custom metrics for:

- `duration_seconds`
- `hints_used`
- `user_responses`
- `score`
- `decisions`

Do not register the internal user ID as a custom dimension. The integration
uses GA4's reserved User-ID setting, which is the correct way to connect an
opted-in signed-in user's sessions without sending personal information.

Use:

- **Reports > Realtime** for installation checks.
- **Reports > Life cycle > Retention** for the standard return-user view.
- **Explore > Funnel exploration** for the activation funnel.
- **Explore > Cohort exploration** for weekly cohorts based on
  `case_completed`.

## 6. Reading retention responsibly

- Analytics begins at deployment and cannot backfill earlier behavior.
- Denied or unanswered consent is not tracked, so dashboard counts will be
  lower than database account/session counts.
- Compare rates and trends, not just raw counts.
- Day-1 retention may be less meaningful for interview practice than weekly
  retention. A strong primary metric is the percentage of first-time case
  completers who complete another case within 7 or 14 days.
- Segment one dimension at a time until traffic is large enough. Small cohorts
  swing dramatically and can create false conclusions.
