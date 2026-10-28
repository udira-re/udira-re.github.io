import Link from "next/link";
import { site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="wrap topbar__inner">
        <Link href="/" className="mark" aria-label={`${site.name}, home`}>
          AP
        </Link>
        <nav aria-label="Main" className="topbar__nav">
          <Link href="/#work">Work</Link>
          <Link href="/writing/">Writing</Link>
          <Link href="/#experience">Experience</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>
          © 2026 {site.name} · {site.location}
        </span>
        <span className="footer__links">
          <a href={site.links.github} rel="me">
            GitHub
          </a>
          <a href={site.links.linkedin} rel="me">
            LinkedIn
          </a>
          <a href={site.links.rubygems}>RubyGems</a>
          <a href="/llms.txt">llms.txt</a>
        </span>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        {items.map((item) => (
          <li key={item.label}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

// Serialises structured data safely for a <script type="application/ld+json"> tag.
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
