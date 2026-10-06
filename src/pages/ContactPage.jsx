import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import ContactForm from '../components/contact/ContactForm.jsx'
import MaskedHeading from '../components/motion/MaskedHeading.jsx'
import { company } from '../data/company.js'
import PageMotion from '../motion/PageMotion.jsx'
import { useSession } from '../state/useSession.js'

export default function ContactPage() {
  const { handoff } = useSession()
  const { t, i18n } = useTranslation()
  const { lang } = useParams()

  return (
    <PageMotion className="inner-page" watch={[i18n.language, handoff?.createdAt]}>
      <section className="page-hero">
        <div className="wrap">
          <p className="fine">
            <Link to={`/${lang}`}>{t('nav.home')}</Link>
            <span> / {t('nav.contact')}</span>
          </p>
          <MaskedHeading as="h1">{t('contact.leadTitle')}</MaskedHeading>
          <p className="lede">{t('contact.leadText')}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap contact-sheet">
          <aside className="contact-info-card">
            <p className="contact-kicker">{t('contact.cardKicker')}</p>
            <MaskedHeading as="h2">{t('contact.cardTitle')}</MaskedHeading>
            <p>{t('contact.cardText')}</p>
            <a href={company.phoneHref}>
              <small>{t('contact.call')}</small>
              <b dir="ltr">{company.phone}</b>
            </a>
            <a href={`mailto:${company.email}`}>
              <small>{t('contact.email')}</small>
              {company.email}
            </a>
            <a href="https://wa.me/966504395551" target="_blank" rel="noopener">
              <small>{t('contact.whatsappPrompt')}</small>
              {t('contact.whatsapp')} ↗
            </a>
          </aside>
          <ContactForm key={handoff?.createdAt ?? 'direct'} handoff={handoff} />
        </div>
      </section>
    </PageMotion>
  )
}
