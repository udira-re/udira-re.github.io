// All portfolio content lives here, so updating the site never means touching layout code.

export const site = {
  url: "https://udira-re.github.io",
  name: "Amshu Pokharel",
  role: "Full-Stack Software Engineer",
  location: "Kathmandu, Nepal",
  email: "pokharelamshu@gmail.com",
  cv: "/Amshu_Pokharel_CV.pdf",
  description:
    "Amshu Pokharel is a full-stack software engineer in Kathmandu, Nepal with 4+ years building production web apps in React, Next.js, TypeScript and Ruby on Rails for European clients.",
  links: {
    github: "https://github.com/udira-re",
    linkedin: "https://www.linkedin.com/in/amshu-pokharel-031016375/",
    rubygems: "https://rubygems.org/gems/codicefiscale_ruby",
  },
  keywords: [
    "Amshu Pokharel",
    "Full-Stack Software Engineer",
    "React developer Nepal",
    "Next.js developer",
    "TypeScript",
    "Ruby on Rails developer",
    "Frontend engineer Kathmandu",
    "Remote software engineer",
  ],
  updated: "2026-10-28",
  // Cloudflare Web Analytics token (public, cookie-free). Leave empty to turn analytics off.
  analyticsToken: "43573a02ddc6408eba8926b72eac5b08",
};

export const stats = [
  { value: "4+", label: "years shipping production software" },
  { value: "8+", label: "client products for European companies" },
  { value: "680", label: "commits as lead frontend on one platform" },
  { value: "39", label: "pull requests merged on that platform" },
];

export type CaseStudy = {
  slug: string;
  kind: string;
  title: string;
  context: string;
  built: string[];
  decisions: string[];
  stack: string[];
  link?: { href: string; label: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "family-platform",
    kind: "Lead frontend · Part-time · 2026",
    title: "Family growth & learning platform",
    context:
      "A live subscription web app where parents guide their children through five developmental phases of lessons, check-ins and community. Client kept confidential.",
    built: [
      "Parent portal and child learning journeys, with growth charts and certificate PDFs",
      "Subscription plans, coupons, upgrades and downgrades with lifecycle-aware feature gating",
      "Server-verified parental PIN and encrypted IDs in URLs to stop cross-account access",
      "Firebase real-time chat, a moderated forum, and analytics that load only after consent",
    ],
    decisions: [
      "Verify the parent PIN on the server, never in the browser",
      "Gate features by the subscription lifecycle, not by plan name",
      "Load analytics only after the visitor accepts cookies",
    ],
    stack: ["Next.js", "TypeScript", "Zustand", "TanStack Query", "React Hook Form", "Zod", "MUI", "Tailwind", "Firebase", "Docker"],
  },
  {
    slug: "inbellezza",
    kind: "Backend · Lumetha · 2026",
    title: "InBellezza: salon & retail management",
    context:
      "The Rails backend behind salons and shops in Italy: appointments, card payments, gift cards and the fiscal receipts Italian law requires.",
    built: [
      "Card-terminal payments with webhooks and live status pushed over ActionCable",
      "Gift cards with issue, redeem, expiry and history, plus VAT rules per service",
      "A4 fiscal receipt PDFs cached on S3, with tax-authority status in the daily cash close",
      "OpenAPI documentation and a self-hosted Swagger UI for the v2 API",
    ],
    decisions: [
      "Check every webhook signature before acting on it",
      "Poll as a fallback when a webhook never arrives",
      "Link a payment to a receipt with one atomic database update",
    ],
    stack: ["Ruby on Rails", "PostgreSQL", "Sidekiq", "Redis", "ActionCable", "Stripe", "AWS S3"],
  },
  {
    slug: "fegime",
    kind: "Frontend · Lumetha · 2026",
    title: "Fegime: B2B back-office CMS",
    context:
      "The content and notification back office for a network of electrical wholesalers, used daily by Italian and English-speaking staff.",
    built: [
      "Push-notification templates for custom content and a content-approval flow",
      "Bulk user actions and sortable data tables",
      "One shared submit pattern that stopped duplicate records on every form",
    ],
    decisions: [
      "One shared save pattern for every form page",
      "Unwrap Redux thunks so forms see the real result",
      "Keep Italian and English translations in sync",
    ],
    stack: ["React", "Redux Toolkit", "MUI", "React Hook Form", "i18next"],
  },
];

export const moreWork = [
  {
    title: "Humanitas University: Transfer Portal",
    summary: "Application forms and admin dashboards, with role-based S3 uploads for sensitive documents and GDPR privacy controls.",
    stack: ["React", "AWS S3"],
  },
  {
    title: "ISMEA: dynamic form platform",
    summary: "A no-code back office for building forms, multi-step public forms, and CAS single sign-on.",
    stack: ["React", "Entando", "CAS SSO"],
  },
  {
    title: "Genesys: 3D printing platform",
    summary: "An interactive 3D model viewer, file uploads and order tracking.",
    stack: ["React", "Three.js", "Tailwind"],
  },
  {
    title: "Aida & Complife",
    summary: "Healthcare marketing dashboards and lead management. Document import and compliance workflows in Vue.js.",
    stack: ["React", "Vue.js", "MUI"],
  },
];

export const openSource = [
  {
    title: "codicefiscale_ruby",
    summary: "A published Ruby gem that generates and validates the Italian tax code (Codice Fiscale).",
    href: "https://rubygems.org/gems/codicefiscale_ruby",
    label: "RubyGems",
    stack: ["Ruby", "OOP", "Semantic versioning"],
  },
  {
    title: "Real-time chat app",
    summary: "Instant messaging over WebSockets with Socket.IO, Zustand state and a responsive Tailwind UI.",
    href: "https://github.com/udira-re/ChatApplication",
    label: "Source on GitHub",
    stack: ["Next.js", "Socket.IO", "Zustand"],
  },
];

export const experience = [
  {
    when: "Jul 2026 – now",
    role: "Full Stack Engineer",
    org: "Lumetha",
    note: "Rails APIs and React/Next.js features for European clients. Code review and frontend standards across projects.",
  },
  {
    when: "Apr 2026 – now",
    role: "Frontend Engineer, part-time",
    org: "Confidential product company",
    note: "Lead frontend engineer on a live Next.js subscription platform.",
  },
  {
    when: "Jan 2022 – Jul 2026",
    role: "Frontend Intern → Frontend Developer",
    org: "Kotuko Nepal (now Lumetha)",
    note: "Started on Angular, then React and Vue.js client work: Fegime, Humanitas, ISMEA, Genesys, Aida, Complife.",
  },
];

export const education = [
  { when: "2024 – now", title: "MBA in IT", org: "Westcliff University (Presidential Business School)" },
  { when: "2019 – 2023", title: "BSc (Hons) Information Technology", org: "University of Sunderland (ISMT College)" },
];

export const stack = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "Vue.js", "Angular", "Three.js"] },
  { group: "State & forms", items: ["Zustand", "Redux Toolkit", "TanStack Query", "React Hook Form", "Zod"] },
  { group: "UI", items: ["Tailwind CSS", "Material UI", "Chakra UI", "Accessibility", "i18n"] },
  { group: "Backend", items: ["Ruby on Rails", "PostgreSQL", "Sidekiq", "Redis", "ActionCable", "Stripe", "Firebase"] },
  { group: "Delivery", items: ["Docker", "GitHub Actions", "Bitbucket Pipelines", "AWS S3", "Vercel", "Claude Code"] },
];
