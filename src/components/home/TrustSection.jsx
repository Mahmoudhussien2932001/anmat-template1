import { about, engagements, sectors } from '../../data/company.js'

export default function TrustSection({ compact = false }) {
  const stories = compact ? engagements.slice(0, 4) : engagements
  return (
    <section className="section" id="trust">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">ثقة مبنية على أعمال موثّقة</p>
          <h2>من الملف التعريفي وخبرات العملاء</h2>
        </div>
        <div className="about-list reveal">
          {about.map((line) => <p key={line}>{line}</p>)}
        </div>
        <ul className="chip-list" aria-label="قطاعات الخبرات">
          {sectors.map((sector) => <li key={sector}>{sector}</li>)}
        </ul>
        <div className="card-grid">
          {stories.map((item) => (
            <article className="info-card reveal" key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
