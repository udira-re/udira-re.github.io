import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/content/articles";
import { caseDetails } from "@/content/caseDetails";
import { caseStudies, site } from "@/content/site";
import { Flow } from "@/components/Flow";
import { Breadcrumbs, JsonLd } from "@/components/SiteChrome";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

function find(slug: string) {
  const study = caseStudies.find((c) => c.slug === slug);
  const detail = caseDetails[slug];
  return study && detail ? { study, detail } : null;
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const found = find(slug);
  if (!found) return {};
  const path = `/work/${slug}/`;
  return {
    title: `${found.study.title} – case study`,
    description: found.detail.metaDescription,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title: found.study.title, description: found.detail.metaDescription },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const found = find(slug);
  if (!found) notFound();
  const { study, detail } = found;
  const article = detail.article ? getArticle(detail.article) : undefined;
  const others = caseStudies.filter((c) => c.slug !== slug);
  const url = `${site.url}/work/${slug}/`;

  return (
    <main className="wrap page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              "@id": `${url}#work`,
              name: study.title,
              description: detail.metaDescription,
              url,
              creator: { "@id": `${site.url}/#person` },
              keywords: study.stack.join(", "),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
                { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/#work` },
                { "@type": "ListItem", position: 3, name: study.title, item: url },
              ],
            },
          ],
        }}
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/#work", label: "Work" }, { label: study.title }]} />

      <header className="page__head">
        <p className="case__kind">{study.kind}</p>
        <h1 className="page__title">{study.title}</h1>
        <p className="page__lead">{study.context}</p>
        <dl className="facts">
          <div>
            <dt>Role</dt>
            <dd>{detail.role}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{detail.period}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{study.stack.join(", ")}</dd>
          </div>
        </dl>
      </header>

      <section className="page__section" aria-labelledby="challenge">
        <h2 id="challenge">The challenge</h2>
        <p className="prose-p">{detail.challenge}</p>
      </section>

      <Flow {...detail.flow} />

      {detail.sections.map((s) => (
        <section key={s.heading} className="page__section">
          <h2>{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p} className="prose-p">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section className="page__section" aria-labelledby="outcome">
        <h2 id="outcome">Outcome</h2>
        <ul className="case__built">
          {detail.outcome.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      {article && (
        <Link href={`/writing/${article.slug}/`} className="callout">
          <span className="callout__kicker">Read the deep dive</span>
          <span className="callout__title">{article.title}</span>
        </Link>
      )}

      <nav className="next" aria-label="More case studies">
        {others.map((o) => (
          <Link key={o.slug} href={`/work/${o.slug}/`} className="next__item">
            <span className="next__kicker">Next case study</span>
            <span className="next__title">{o.title} →</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
