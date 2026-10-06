import { services } from '../../data/company.js'

export default function ServicesSection({ detailed = false }) {
  const items = detailed ? services : services.slice(0, 6)
  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">خدمات موثّقة</p>
          <h2>ما نطوّره مع العلامة</h2>
        </div>
        <div className="card-grid">
          {items.map((service) => (
            <article className="info-card reveal" key={service.id}>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
