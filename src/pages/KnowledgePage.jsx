import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { aboutCopy, articles, faqs, methodSteps, serviceScopeNote, teams, htmlServices } from '../data/sourceContent.js'
import MaskedHeading from '../components/motion/MaskedHeading.jsx'
import PageMotion from '../motion/PageMotion.jsx'

function pick(copy, english) {
  return english ? copy.en : copy.ar
}

export default function KnowledgePage() {
  const { i18n } = useTranslation()
  const { lang } = useParams()
  const english = i18n.language === 'en'

  return (
    <PageMotion className="inner-page" watch={[english]}>
      <section className="section">
        <div className="wrap">
          <div className="area-list">
            {articles.map((article) => (
              <details key={article.id}>
                <summary>
                  <span>{pick(article.date, english)}</span>
                  {pick(article.title, english)}
                </summary>
                <p className="fine">{pick(article.category, english)}</p>
                {article.paragraphs[english ? 'en' : 'ar'].map((paragraph) => (
                  <p key={paragraph} style={{ marginTop: 10 }}>{paragraph}</p>
                ))}
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="about">
        <div className="wrap">
          <p className="eyebrow">{pick(aboutCopy.kicker, english)}</p>
          <MaskedHeading as="h2">{pick(aboutCopy.title, english)}</MaskedHeading>
          <p className="about-intro">{pick(aboutCopy.text, english)}</p>
          <div className="about-grid">
            <div>
              <p className="eyebrow">{pick(aboutCopy.systems, english)}</p>
              <MaskedHeading as="h2">{pick(aboutCopy.growth, english)}</MaskedHeading>
              <p>{pick(aboutCopy.bridge, english)}</p>
              <p className="fine">{pick(aboutCopy.credential, english)}</p>
            </div>
            <div className="glass-card about-visual">
              <div className="about-orbit">
                <b>360°</b>
                <span>{pick(aboutCopy.orbit, english)}</span>
              </div>
            </div>
          </div>
          <div className="about-paths">
            <article className="price-card">
              <MaskedHeading as="h3">{pick(aboutCopy.visionTitle, english)}</MaskedHeading>
              <p className="fine">{pick(aboutCopy.vision, english)}</p>
            </article>
            <article className="price-card">
              <MaskedHeading as="h3">{pick(aboutCopy.missionTitle, english)}</MaskedHeading>
              <p className="fine">{pick(aboutCopy.mission, english)}</p>
            </article>
          </div>
          <div className="about-team-head">
            <p className="eyebrow">{pick(aboutCopy.teamKicker, english)}</p>
            <MaskedHeading as="h2">{pick(aboutCopy.teamTitle, english)}</MaskedHeading>
          </div>
          <div className="about-teams">
            {teams.map((team) => (
              <article key={team.title.en} className="price-card">
                <MaskedHeading as="h3">{pick(team.title, english)}</MaskedHeading>
                <p className="fine">{pick(team.text, english)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <MaskedHeading as="h2">{english ? 'Services and scope' : 'الخدمات ونطاقها'}</MaskedHeading>
          <p className="fine" style={{ margin: '10px 0 18px' }}>{pick(serviceScopeNote, english)}</p>
          <div className="area-list">
            {htmlServices.map((service) => (
              <details key={service.id}>
                <summary>{pick(service.title, english)}</summary>
                <p>{pick(service.text, english)}</p>
                <ul className="check-list">
                  {service.scope[english ? 'en' : 'ar'].map((item) => (
                    <li key={item}><span className="check" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <MaskedHeading as="h2">{english ? 'Method' : 'منهجيتنا'}</MaskedHeading>
          <div className="pricing-grid" style={{ marginTop: 18 }}>
            {methodSteps.map((step) => (
              <article key={step.id} className="price-card">
                <p className="fine">{step.id}</p>
                <MaskedHeading as="h3">{pick(step.title, english)}</MaskedHeading>
                <p className="fine" style={{ marginTop: 8 }}>{pick(step.text, english)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <div>
            <MaskedHeading as="h2">{english ? 'Common questions' : 'الأسئلة الشائعة'}</MaskedHeading>
            <Link className="button" style={{ marginTop: 16 }} to={`/${lang}/contact`}>{english ? 'Talk with us' : 'تحدث معنا'}</Link>
          </div>
          <div className="area-list">
            {faqs.map((item) => (
              <details key={item.q.en}>
                <summary>{pick(item.q, english)}</summary>
                <p>{pick(item.a, english)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageMotion>
  )
}
