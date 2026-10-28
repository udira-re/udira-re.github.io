import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { site, stack } from "@/content/site";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const body = Figtree({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

const title = `${site.name} – ${site.role} (React, Next.js, Ruby on Rails)`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    firstName: "Amshu",
    lastName: "Pokharel",
    username: "udira-re",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Set GOOGLE_SITE_VERIFICATION in the deploy workflow once Search Console gives you the code.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
  colorScheme: "light dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#page`,
      url: `${site.url}/`,
      name: title,
      dateModified: site.updated,
      mainEntity: { "@id": `${site.url}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: ["Amshu Pokhrel", "udira-re"],
      jobTitle: site.role,
      description: site.description,
      url: `${site.url}/`,
      image: `${site.url}/amshu-pokharel.jpg`,
      email: `mailto:${site.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
      worksFor: { "@type": "Organization", name: "Lumetha" },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "University of Sunderland" },
        { "@type": "CollegeOrUniversity", name: "Westcliff University" },
      ],
      knowsAbout: stack.flatMap((g) => g.items),
      sameAs: Object.values(site.links),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      name: site.name,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#person` },
    },
  ],
};

// Applies the saved theme before first paint so there is no light/dark flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        {site.analyticsToken && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: site.analyticsToken })}
          />
        )}
      </body>
    </html>
  );
}
