// Technical articles at /writing/[slug]. Code samples are simplified from real production work.

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  published: string;
  readingMinutes: number;
  tags: string[];
  caseStudy?: string;
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "card-terminal-payments-rails",
    title: "Card-terminal payments in Rails without double charges or double receipts",
    description:
      "How I wired a physical card terminal into a Rails API: signed webhooks, a status mapper, live updates over ActionCable, a fallback job, and an atomic receipt link.",
    published: "2026-10-28",
    readingMinutes: 6,
    tags: ["Ruby on Rails", "Payments", "ActionCable", "Sidekiq"],
    caseStudy: "inbellezza",
    body: [
      {
        type: "p",
        text: "In a salon, a payment isn't a form post. Staff start it on a screen, the customer taps a card on a terminal across the room, and the screen has to know the result within a second or two. If anything goes wrong in between, nobody may be charged twice and no payment may end up on two receipts. Here is how I built that flow in a Rails API for an Italian salon and retail platform, using Dojo card terminals.",
      },
      { type: "h2", text: "1. Lock before you start" },
      {
        type: "p",
        text: "Two staff members can press Pay at the same moment for the same terminal. Starting a payment therefore runs inside a row lock on the shop's event record, so the second request waits and then sees the terminal is busy.",
      },
      {
        type: "code",
        lang: "ruby",
        code: `payment = event.with_lock do
  raise Busy if terminal_busy?(terminal_id)
  raise InvalidAmount unless amount.to_d > 0

  DojoPayment.create!(event:, user:, amount:, status: PROCESSING)
end

Dojo::RefreshPaymentJob.set(wait: 20.seconds).perform_later(payment.id)`,
      },
      {
        type: "p",
        text: "The amount check sits here, before any request reaches the terminal. A zero or negative amount is a bug upstream, and it is cheaper to stop it at the door.",
      },
      { type: "h2", text: "2. Trust webhooks only after checking the signature" },
      {
        type: "p",
        text: "The provider calls a webhook whenever a terminal session changes. The endpoint is public, so the first thing it does is recompute an HMAC-SHA256 of the raw body with the shop's secret and compare it in constant time. Only then does it look up the payment and refresh it.",
      },
      {
        type: "code",
        lang: "ruby",
        code: `def valid_signature?(payload, header, secret)
  return false if secret.blank? || header.blank?

  expected = OpenSSL::HMAC.hexdigest("SHA256", secret, payload)
  received = header.delete_prefix("sha256=").downcase
  ActiveSupport::SecurityUtils.secure_compare(expected, received)
end`,
      },
      {
        type: "p",
        text: "Note that the webhook doesn't trust the status inside the payload either. It asks the provider's API for the current session state, the same call the fallback job makes. That keeps one code path for updating a payment.",
      },
      { type: "h2", text: "3. Map ten states to the few the UI needs" },
      {
        type: "p",
        text: "The provider has around ten session states, from InitiateRequested to SignatureVerificationRejected. The front desk only needs to know: still processing, needs a signature, succeeded, or failed for a specific reason. A small mapper does that, and anything unknown becomes an error instead of a silent success.",
      },
      {
        type: "code",
        lang: "ruby",
        code: `DOJO_TO_CODE = {
  "Initiated"                     => PROCESSING,
  "SignatureVerificationRequired" => SIGNATURE_REQUIRED,
  "Captured"                      => SUCCESS,
  "Declined"                      => DECLINED,
  "Canceled"                      => CANCELLED,
  "Expired"                       => TIMEOUT,
  # ...
}.freeze

def self.code_for(status) = DOJO_TO_CODE.fetch(status, ERROR)`,
      },
      { type: "h2", text: "4. Push the result to the screen" },
      {
        type: "p",
        text: "Every time a payment's status changes, it broadcasts on an ActionCable channel. The channel checks that the subscriber is allowed to see that shop's payments, then sends the current status immediately, so a screen that subscribes late still starts in the right state.",
      },
      {
        type: "code",
        lang: "ruby",
        code: `class DojoPaymentsChannel < ApplicationCable::Channel
  def subscribed
    payment = DojoPayment.find_by(id: params[:id])
    return reject unless payment && allowed_event?(payment.event_id)

    stream_for payment
    transmit payment.status_payload
  end
end`,
      },
      { type: "h2", text: "5. Assume the webhook will sometimes not come" },
      {
        type: "p",
        text: "Networks fail and webhooks get lost. A background job refreshes the payment 20 seconds after it starts and keeps rescheduling itself until the payment reaches a final state or ten minutes pass. Most of the time the webhook has already done the work and the job exits on its first run.",
      },
      {
        type: "code",
        lang: "ruby",
        code: `def perform(payment_id)
  payment = DojoPayment.find_by(id: payment_id)
  return if payment.nil? || payment.final?

  Dojo::PaymentService.new(payment.event).refresh(payment)
  return if payment.final? || payment.created_at < 10.minutes.ago

  self.class.set(wait: 20.seconds).perform_later(payment.id)
end`,
      },
      { type: "h2", text: "6. Link the receipt exactly once" },
      {
        type: "p",
        text: "The last risk is the receipt. If the front desk retries a checkout, two requests can try to attach the same successful payment to two receipts. Reading the payment, checking receipt_id and then saving leaves a gap between the check and the write. A single conditional UPDATE closes it: the database only links the payment if it isn't linked yet, and tells us how many rows changed.",
      },
      {
        type: "code",
        lang: "ruby",
        code: `linked = DojoPayment
  .where(id: payment.id, receipt_id: nil)
  .update_all(receipt_id: receipt.id)

raise AlreadyUsed if linked.zero?`,
      },
      { type: "h2", text: "What I'd keep for any payment integration" },
      {
        type: "list",
        items: [
          "Verify webhook signatures on the raw body, in constant time, before parsing anything you act on.",
          "Re-fetch state from the provider instead of trusting the webhook payload.",
          "Map provider states to your own small set, and default unknown states to an error.",
          "Have a polling fallback with a hard time limit.",
          "Use the database, not application code, to guarantee one-time links.",
        ],
      },
    ],
  },
  {
    slug: "consent-first-analytics-nextjs",
    title: "Consent-first analytics in Next.js: load Google Tag Manager only after opt-in",
    description:
      "A GDPR-friendly pattern for Next.js: no tracking scripts until the visitor accepts, a consent record that expires and re-asks, and purchase events that fire exactly once.",
    published: "2026-10-28",
    readingMinutes: 5,
    tags: ["Next.js", "React", "GDPR", "Analytics"],
    caseStudy: "family-platform",
    body: [
      {
        type: "p",
        text: "Most analytics setups paste the Google Tag Manager snippet into the root layout and then show a cookie banner on top. By the time the visitor reads the banner, the tags have already run. On a subscription platform for families that I work on, we flipped that around: nothing that tracks people loads until they say yes. Here's the pattern.",
      },
      { type: "h2", text: "1. Store the choice with a date and a version" },
      {
        type: "p",
        text: "A consent choice isn't forever. We save it with a timestamp and a version number. A choice older than a year, or saved under an older version, counts as no choice, so the banner asks again. When we added session recordings, bumping the version re-asked everyone, which is what the law expects when the purpose changes.",
      },
      {
        type: "code",
        lang: "ts",
        code: `const CONSENT_VERSION = 2; // 2: added session recordings
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export function getCookieChoice(): "accepted" | "declined" | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!saved || saved.version !== CONSENT_VERSION) return null;
    const age = Date.now() - new Date(saved.at).getTime();
    return age >= 0 && age < MAX_AGE_MS ? saved.choice : null;
  } catch {
    return memoryChoice; // storage blocked: remember for this visit only
  }
}`,
      },
      {
        type: "p",
        text: "The in-memory fallback matters more than it looks. Some browsers block storage entirely, and without it the banner would reappear on every page.",
      },
      { type: "h2", text: "2. Load the tag manager on demand" },
      {
        type: "p",
        text: "Google's snippet is just a script tag plus one dataLayer push. Wrapping it in a function lets us call it only after consent, and the id check makes it safe to call more than once.",
      },
      {
        type: "code",
        lang: "ts",
        code: `export function loadGtm() {
  if (typeof window === "undefined" || document.getElementById("gtm-script")) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = \`https://www.googletagmanager.com/gtm.js?id=\${GTM_ID}\`;
  document.head.appendChild(script);
}`,
      },
      { type: "h2", text: "3. Subscribe to the choice, don't poll it" },
      {
        type: "p",
        text: "The banner and the settings page both read the same choice. useSyncExternalStore keeps them in sync, including across browser tabs through the storage event, without any effect that sets state on mount.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `const choice = useSyncExternalStore(subscribeToCookieChoice, getCookieChoice, () => null);

useEffect(() => {
  if (choice === "accepted" && !onChildScreen) loadGtm();
}, [choice, onChildScreen]);`,
      },
      {
        type: "p",
        text: "Children's screens never load the tag manager, even after a parent accepts. That rule lives next to the loader so nobody adds tracking to a child page by accident.",
      },
      { type: "h2", text: "4. Make declining as easy as accepting" },
      {
        type: "p",
        text: "Both buttons have the same size and weight. A link in the footer and a tab in settings reopen the banner, so people can change their mind later. This is a legal requirement in the EU, and it is also simply fair.",
      },
      { type: "h2", text: "5. Fire the purchase event exactly once" },
      {
        type: "p",
        text: "After Stripe checkout, the visitor lands on a success page. If that page fires the purchase event, a refresh or a typed-in URL fires it again and inflates revenue. Instead, the price (after any coupon) is parked in sessionStorage when checkout starts. The success page reads it, deletes it, and only then pushes the event. No parked purchase, no event.",
      },
      {
        type: "code",
        lang: "ts",
        code: `export function trackPendingPurchase() {
  const raw = sessionStorage.getItem(PENDING_KEY);
  sessionStorage.removeItem(PENDING_KEY);
  const purchase = raw ? JSON.parse(raw) : null;
  if (!purchase || !Number.isFinite(purchase.value)) return;

  window.dataLayer?.push({ event: "purchase", value: purchase.value, currency: purchase.currency });
}`,
      },
      { type: "h2", text: "The checklist" },
      {
        type: "list",
        items: [
          "No tracking script in the root layout. Load it from code after consent.",
          "Save the choice with a timestamp and a version, and expire it.",
          "Fall back to memory when storage is blocked.",
          "Keep tracking off pages for children, whatever the consent.",
          "Give Decline the same weight as Accept, and a way back to change it.",
          "Fire conversion events from a one-time hand-off, not from a page load.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
