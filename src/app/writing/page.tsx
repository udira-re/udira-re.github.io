import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/articles";
import { site } from "@/content/site";
import { Breadcrumbs, JsonLd } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Writing",
  description: "Technical articles by Amshu Pokharel on Next.js, React and Ruby on Rails, drawn from production work.",
  alternates: { canonical: "/writing/" },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function WritingIndex() {
  return (
    <main className="wrap page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `Writing by ${site.name}`,
          url: `${site.url}/writing/`,
          author: { "@id": `${site.url}/#person` },
          blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${site.url}/writing/${a.slug}/`, datePublished: a.published })),
        }}
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Writing" }]} />
      <header className="page__head">
        <h1 className="page__title">Writing</h1>
        <p className="page__lead">Notes from production work: the problems, the code, and what I&apos;d do again.</p>
      </header>
      <ol className="posts">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/writing/${a.slug}/`} className="post">
              <span className="post__meta">
                {dateFormat.format(new Date(a.published))} · {a.readingMinutes} min read
              </span>
              <span className="post__title">{a.title}</span>
              <span className="post__desc">{a.description}</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
