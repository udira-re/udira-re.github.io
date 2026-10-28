// Long-form detail for each case study page at /work/[slug]. Keyed by the slug in site.ts.

export type FlowStep = { label: string; detail: string };

export type CaseDetail = {
  metaDescription: string;
  role: string;
  period: string;
  challenge: string;
  flow: { title: string; caption: string; steps: FlowStep[] };
  sections: { heading: string; body: string[] }[];
  outcome: string[];
  article?: string;
};

export const caseDetails: Record<string, CaseDetail> = {
  "family-platform": {
    metaDescription:
      "Case study: lead frontend engineering on a live Next.js subscription platform for families. Parent portal, subscriptions, PIN security and consent-first analytics.",
    role: "Lead frontend engineer (part-time)",
    period: "Apr 2026 – now",
    challenge:
      "Parents and children share one device. Children use their own learning screens, and parents manage billing, settings and progress. The app had to keep those two worlds apart, sell subscriptions cleanly, and track conversions without breaking privacy law in the countries it sells to.",
    flow: {
      title: "How the parent area stays locked",
      caption: "The PIN is checked by the server every time, including when the browser restores a cached page.",
      steps: [
        { label: "Child mode", detail: "The child uses their own screens. Parent links are hidden." },
        { label: "Parent taps “Parent portal”", detail: "The app opens a PIN gate instead of the page." },
        { label: "Server verifies PIN", detail: "No client-side check. A wrong PIN never reveals the page." },
        { label: "Parent portal", detail: "Billing, settings, child profiles and progress." },
        { label: "Back / Forward", detail: "On a cached restore, child mode is re-checked and the gate shows again." },
      ],
    },
    sections: [
      {
        heading: "Owning the frontend",
        body: [
          "I wrote about 680 of the project's ~810 commits and merged 39 pull requests. That covers the parent portal, the child learning journeys across five developmental phases, weekly waypoints and lessons, emotion check-ins, growth charts, and certificate PDFs laid out as a two-page passport spread.",
          "State lives in Zustand stores with TanStack Query for server data. Forms use React Hook Form with Zod schemas, so API errors map straight back onto the right field.",
        ],
      },
      {
        heading: "Subscriptions that match the billing API",
        body: [
          "Plans, coupons, upgrades and downgrades follow the backend's subscription lifecycle. Features are gated by the plan's current state, the annual-savings badge is computed from real plan prices, and a coupon is carried through the whole checkout instead of being re-entered.",
        ],
      },
      {
        heading: "Security on a shared device",
        body: [
          "The parent area sits behind a PIN the server verifies, not a client-side flag. Child IDs in URLs are encrypted, and the dashboard refuses to load a child that doesn't belong to the signed-in parent. Password reset uses a one-time token and stays unauthenticated.",
        ],
      },
      {
        heading: "Analytics that wait for consent",
        body: [
          "Google Tag Manager and Microsoft Clarity load only after the visitor accepts cookies, never on page load. Declining is as easy as accepting, the choice expires after a year, and a version number re-asks everyone when the cookie purposes change. Sign-up and purchase events fire once, even if the success page is refreshed.",
        ],
      },
    ],
    outcome: [
      "Taken through launch with subscriptions, community and analytics in place",
      "GDPR-compliant tracking from day one, with conversion events the marketing team can use",
      "Docker builds and a GitHub Actions pipeline deploying to staging and production",
    ],
    article: "consent-first-analytics-nextjs",
  },
  inbellezza: {
    metaDescription:
      "Case study: Ruby on Rails backend for salon and retail management in Italy. Card-terminal payments, gift cards, VAT and fiscal receipts.",
    role: "Backend engineer (Ruby on Rails)",
    period: "2026",
    challenge:
      "Salons take card payments on a physical terminal while staff watch a screen. The backend has to know the moment a payment succeeds, survive lost webhooks, never charge or receipt twice, and produce receipts that satisfy Italian tax rules.",
    flow: {
      title: "A card payment, end to end",
      caption: "Webhooks are the fast path. A background job is the safety net if a webhook never arrives.",
      steps: [
        { label: "Start payment", detail: "Staff pick a terminal. The event row is locked so one terminal can't take two payments." },
        { label: "Terminal", detail: "The customer taps or inserts a card. Signature checks are handled if the card asks." },
        { label: "Signed webhook", detail: "Rails checks an HMAC-SHA256 signature before trusting anything." },
        { label: "Status mapper", detail: "Ten provider states become one clear status per payment." },
        { label: "Live update", detail: "ActionCable pushes the status to the front desk instantly." },
        { label: "Receipt", detail: "Linked once, atomically. The PDF is cached on S3." },
      ],
    },
    sections: [
      {
        heading: "Payments you can trust",
        body: [
          "I integrated Dojo card terminals into the v2 API: a payment service, a status mapper, a signed webhook endpoint, a live ActionCable channel, and a refresh job that polls every 20 seconds for up to 10 minutes in case a webhook is lost.",
          "Linking a payment to a receipt is a single conditional update, so two requests racing for the same payment can't both succeed. Zero or negative amounts are rejected before a terminal is ever touched.",
        ],
      },
      {
        heading: "Gift cards and VAT",
        body: [
          "Gift cards support issue, redemption, expiry and history. Services carry their own VAT rate, customers can be VAT-exempt, and the single-default-rate rules are enforced in the model, not the UI.",
        ],
      },
      {
        heading: "Fiscal receipts",
        body: [
          "Receipts render as A4 PDFs that staff can email or print. They're cached on S3 instead of re-rendered, and each one records its tax-authority (AdE) status, which now shows in the daily cash close.",
        ],
      },
      {
        heading: "An API other teams can use",
        body: ["I fixed the OpenAPI spec, documented the missing v2 endpoints and receipts, and added a self-hosted Swagger UI."],
      },
    ],
    outcome: [
      "Card payments reported live to the front desk, with a fallback when webhooks fail",
      "No double receipts for one payment",
      "Receipt PDFs served from S3 instead of re-rendered on every download",
    ],
    article: "card-terminal-payments-rails",
  },
  fegime: {
    metaDescription:
      "Case study: React and Redux back-office CMS for a network of electrical wholesalers. Push notifications, content approval and safer forms.",
    role: "Frontend developer (React)",
    period: "2026",
    challenge:
      "A busy back office where staff create content, push notifications and manage users. Double-clicks on Save were creating duplicate records, and new content types needed notification support without a rewrite.",
    flow: {
      title: "One save pattern for every form",
      caption: "The fix that stopped duplicate records across all form pages.",
      steps: [
        { label: "Click Save", detail: "React Hook Form marks the form as submitting." },
        { label: "Button disabled", detail: "A second click can't send a second request." },
        { label: "dispatch(...).unwrap()", detail: "The Redux thunk's real result or error comes back to the form." },
        { label: "Success or error", detail: "The form shows the outcome and re-enables Save." },
      ],
    },
    sections: [
      {
        heading: "Safer forms everywhere",
        body: [
          "I replaced ad-hoc loading flags with React Hook Form's submitting state and unwrapped Redux thunks on every form page, so each save resolves or fails exactly once.",
        ],
      },
      {
        heading: "Notifications for custom content",
        body: [
          "Custom content can now send a push notification with its own template and timing, and those notifications show up in the report filters.",
        ],
      },
      {
        heading: "Admin quality of life",
        body: ["Bulk delete with multi-select, sortable tables that sort on the right API fields, and a content-approval page, with Italian and English translations kept in sync."],
      },
    ],
    outcome: ["Duplicate records from double-clicks stopped", "Custom content gained push notifications without a new screen"],
  },
};
