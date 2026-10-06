import { processSteps } from '../../data/company.js'

export default function ProcessSection() {
  return (
    <section className="section section-muted" id="process">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">خمس خطوات</p>
          <h2>منهج تطوير الامتياز</h2>
        </div>
        <ol className="process-list">
          {processSteps.map((step) => (
            <li className="reveal" key={step.id}>
              <span>{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.summary}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
