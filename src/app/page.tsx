import { CopyEmail } from "@/components/CopyEmail";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/content/articles";
import { TimeOverlap } from "@/components/TimeOverlap";
import {
  caseStudies,
  education,
  experience,
  moreWork,
  openSource,
  site,
  stack,
  stats,
} from "@/content/site";

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="chips" aria-label="Tech stack">
      {items.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <main id="top">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero__text">
            <p className="eyebrow">
              {site.name} · {site.role}
            </p>
            <h1 id="hero-title" className="hero__title">
              I build the parts of web apps that handle <em>money</em>, <em>privacy</em> and <em>people</em>.
            </h1>
            <p className="hero__lead">
              React, Next.js and TypeScript on the front, Ruby on Rails behind it. For 4+ years I&apos;ve shipped
              subscription platforms, payment flows and back offices for companies across Europe, from Kathmandu.
            </p>
            <div className="hero__actions">
              <CopyEmail email={site.email} className="btn btn--primary" />
              <a className="btn" href={site.cv} download>
                Download CV
              </a>
              <a className="btn btn--ghost" href={site.links.github} rel="me">
                GitHub
              </a>
              <a className="btn btn--ghost" href={site.links.linkedin} rel="me">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="hero__side">
            <figure className="portrait">
              <Image src="/amshu-pokharel.jpg" alt={`${site.name}, ${site.role}`} width={800} height={800} priority />
              <figcaption>
                <strong>{site.name}</strong>
                <span>{site.location}</span>
              </figcaption>
            </figure>
            <TimeOverlap />
          </div>
        </section>

        <section className="wrap proof" aria-label="At a glance">
          <dl className="proof__list">
            {stats.map((s) => (
              <div key={s.label} className="proof__item">
                <dt className="proof__value">{s.value}</dt>
                <dd className="proof__label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="work" className="section wrap" aria-labelledby="work-title">
          <div className="section__head">
            <h2 id="work-title">Selected work</h2>
            <p>Three products I know line by line. Each has a full case study.</p>
          </div>

          <div className="cases">
            {caseStudies.map((c) => (
              <article key={c.slug} id={c.slug} className="case">
                <div className="case__body">
                  <p className="case__kind">{c.kind}</p>
                  <h3 className="case__title">{c.title}</h3>
                  <p className="case__context">{c.context}</p>
                  <ul className="case__built">
                    {c.built.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <Chips items={c.stack} />
                  <Link href={`/work/${c.slug}/`} className="case__more">
                    Read the case study <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <figure className="log" aria-label={`Key decisions in ${c.title}`}>
                  <figcaption className="log__cap">Key engineering decisions</figcaption>
                  <ol className="log__lines">
                    {c.decisions.map((d, i) => (
                      <li key={d}>
                        <span className="log__hash">{String(i + 1).padStart(2, "0")}</span>
                        <span className="log__msg">{d}</span>
                      </li>
                    ))}
                  </ol>
                </figure>
              </article>
            ))}
          </div>

          <h3 className="subhead">More client work</h3>
          <div className="grid">
            {moreWork.map((w) => (
              <article key={w.title} className="tile">
                <h4>{w.title}</h4>
                <p>{w.summary}</p>
                <Chips items={w.stack} />
              </article>
            ))}
          </div>

          <h3 className="subhead">Open source & side projects</h3>
          <div className="grid">
            {openSource.map((o) => (
              <article key={o.title} className="tile">
                <h4>{o.title}</h4>
                <p>{o.summary}</p>
                <a className="tile__link" href={o.href} rel="noopener">
                  {o.label} ↗
                </a>
                <Chips items={o.stack} />
              </article>
            ))}
          </div>
        </section>

        <section id="writing" className="section wrap" aria-labelledby="writing-title">
          <div className="section__head">
            <h2 id="writing-title">Writing</h2>
            <p>
              <Link href="/writing/">All articles →</Link>
            </p>
          </div>
          <ol className="posts">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/writing/${a.slug}/`} className="post">
                  <span className="post__meta">{a.readingMinutes} min read · {a.tags.slice(0, 2).join(" · ")}</span>
                  <span className="post__title">{a.title}</span>
                  <span className="post__desc">{a.description}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="experience" className="section wrap" aria-labelledby="exp-title">
          <div className="section__head">
            <h2 id="exp-title">Experience</h2>
            <p>From Angular intern to owning features end to end.</p>
          </div>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.role + e.org} className="timeline__item">
                <span className="timeline__when">{e.when}</span>
                <div>
                  <h3 className="timeline__role">
                    {e.role} <span>· {e.org}</span>
                  </h3>
                  <p>{e.note}</p>
                </div>
              </li>
            ))}
          </ol>

          <h3 className="subhead">Education</h3>
          <ol className="timeline">
            {education.map((e) => (
              <li key={e.title} className="timeline__item">
                <span className="timeline__when">{e.when}</span>
                <div>
                  <h3 className="timeline__role">
                    {e.title} <span>· {e.org}</span>
                  </h3>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="stack" className="section wrap" aria-labelledby="stack-title">
          <div className="section__head">
            <h2 id="stack-title">Stack</h2>
            <p>What I use in production, grouped by where it sits.</p>
          </div>
          <div className="stack">
            {stack.map((g) => (
              <div key={g.group} className="stack__group">
                <h3>{g.group}</h3>
                <Chips items={g.items} />
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact wrap" aria-labelledby="contact-title">
          <h2 id="contact-title" className="contact__title">
            Building something with React, Next.js or Rails?
          </h2>
          <p className="contact__lead">Email is the fastest way to reach me, or find me on LinkedIn.</p>
          <div className="hero__actions">
            <CopyEmail email={site.email} className="btn btn--primary" />
            <a className="btn" href={site.cv} download>
              Download CV
            </a>
          </div>
        </section>
      </main>

    </>
  );
}
