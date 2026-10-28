import type { Block } from "@/content/articles";

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "list":
            return (
              <ul key={i}>
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "code":
            return (
              <div key={i} className="codeblock">
                <span className="codeblock__lang">{b.lang}</span>
                <pre>
                  <code>{b.code}</code>
                </pre>
              </div>
            );
        }
      })}
    </div>
  );
}
