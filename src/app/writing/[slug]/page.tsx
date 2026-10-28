import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/content/articles";
import { caseStudies, site } from "@/content/site";
import { ArticleBody } from "@/components/ArticleBody";
import { Breadcrumbs, JsonLd } from "@/components/SiteChrome";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = getArticle(slug);
  if (!a) return {};
  const path = `/writing/${slug}/`;
  return {
    title: a.title,
    description: a.description,
    keywords: a.tags,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: a.title,
      description: a.description,
      publishedTime: a.published,
      authors: [site.url],
      tags: a.tags,
    },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function ArticlePage(props: PageProps<"/writing/[slug]">) {
  const { slug } = await props.params;
  const a = getArticle(slug);
  if (!a) notFound();
  const study = caseStudies.find((c) => c.slug === a.caseStudy);
  const url = `${site.url}/writing/${slug}/`;

  return (
    <main className="wrap page page--narrow">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TechArticle",
              headline: a.title,
              description: a.description,
              datePublished: a.published,
              dateModified: a.published,
              url,
              mainEntityOfPage: url,
              keywords: a.tags.join(", "),
              author: { "@id": `${site.url}/#person`, "@type": "Person", name: site.name, url: `${site.url}/` },
              image: `${site.url}/opengraph-image.png`,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
                { "@type": "ListItem", position: 2, name: "Writing", item: `${site.url}/writing/` },
                { "@type": "ListItem", position: 3, name: a.title, item: url },
              ],
            },
          ],
        }}
      />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/writing/", label: "Writing" }, { label: a.title }]} />
      <article>
        <header className="page__head">
          <p className="post__meta">
            <time dateTime={a.published}>{dateFormat.format(new Date(a.published))}</time> · {a.readingMinutes} min read
          </p>
          <h1 className="page__title page__title--article">{a.title}</h1>
          <p className="page__lead">{a.description}</p>
          <ul className="chips" aria-label="Topics">
            {a.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </header>
        <ArticleBody blocks={a.body} />
        <footer className="byline">
          <Image src="/amshu-pokharel.jpg" alt="" width={56} height={56} className="byline__photo" />
          <p>
            Written by <Link href="/">{site.name}</Link>, {site.role.toLowerCase()} in {site.location}.
            {study && (
              <>
                {" "}
                See the project behind it: <Link href={`/work/${study.slug}/`}>{study.title}</Link>.
              </>
            )}
          </p>
        </footer>
      </article>
    </main>
  );
}
