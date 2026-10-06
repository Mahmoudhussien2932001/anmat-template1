import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MagneticLink } from '../motion/MagneticLink.jsx'
import ContactForm from '../contact/ContactForm.jsx'
import { useSession } from '../../state/useSession.js'

export default function FinaleStage() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const { handoff, audience, setAudience } = useSession()

  return (
    <section className="finale-stage" id="contact" data-header-theme="dark">
      <div className="wrap finale-layout">
        <div>
          <h2>{t('finale.title')}</h2>
          <p>{t('finale.text')}</p>
          <div className="path-switch" role="group" aria-label={t('switch.label')}>
            <button type="button" className={audience === 'franchisor' ? 'is-selected' : ''} onClick={() => setAudience('franchisor')}>{t('finale.franchisorPath')}</button>
            <button type="button" className={audience === 'investor' ? 'is-selected' : ''} onClick={() => setAudience('investor')}>{t('finale.investorPath')}</button>
          </div>
          <MagneticLink className="button button-gold" to={`/${lang}/contact`}>{t('finale.action')}</MagneticLink>
        </div>
        <ContactForm key={`${handoff?.createdAt ?? 'home'}-${audience}`} handoff={handoff} audience={audience} />
      </div>
    </section>
  )
}
