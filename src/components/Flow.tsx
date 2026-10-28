import type { FlowStep } from "@/content/caseDetails";

// A system diagram drawn in HTML so it reflows to a vertical sequence on phones.
export function Flow({ title, caption, steps }: { title: string; caption: string; steps: FlowStep[] }) {
  return (
    <figure className="flow">
      <figcaption className="flow__head">
        <span className="flow__title">{title}</span>
        <span className="flow__caption">{caption}</span>
      </figcaption>
      <ol className="flow__steps">
        {steps.map((step, i) => (
          <li key={step.label} className="flow__step">
            <span className="flow__n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <strong className="flow__label">{step.label}</strong>
            <span className="flow__detail">{step.detail}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
