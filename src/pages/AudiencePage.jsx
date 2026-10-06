import { useEffect } from 'react'
import { useOutletContext } from 'react-router'
import { useTranslation } from 'react-i18next'
import { methodology, solutions, values } from '../data/company.js'
import PageMotion from '../motion/PageMotion.jsx'
import { useSession } from '../state/useSession.js'
import { MagneticButton } from '../components/motion/MagneticLink.jsx'
import MaskedHeading from '../components/motion/MaskedHeading.jsx'

const valueCopy = {
  innovation: { en: 'Innovation', text: 'Developing franchise models with lasting success in mind.' },
  impact: { en: 'Impact', text: 'Concrete results in the franchise sector.' },
  specialization: { en: 'Specialization', text: 'Integrated work guided by franchise practice.' },
  leadership: { en: 'Leadership', text: 'Franchise advice at local and regional scale.' },
}

export default function AudiencePage({ audience }) {
  const { openAssessment } = useOutletContext()
  const { setAudience } = useSession()
  const { t, i18n } = useTranslation()
  const english = i18n.language === 'en'
  useEffect(() => {
    setAudience(audience)
  }, [audience, setAudience])

  return (
    <PageMotion className="inner-page" watch={[audience, english]}>
      <section className="page-hero">
        <div className="wrap">
          <p className="fine">{t(`audiencePage.${audience}`)}</p>
          <MaskedHeading as="h1">{t(`hero.${audience}Lead`)}</MaskedHeading>
          <p className="lede">{t(`hero.${audience}Support`)}</p>
          <MagneticButton className="button button-gold" onClick={(event) => openAssessment(audience, event)}>
            {t('audiencePage.action')}
          </MagneticButton>
        </div>
      </section>
      {audience === 'franchisor' ? (
        <section className="section">
          <div className="wrap split-copy">
            <ul className="editorial-list">
              {solutions.map((item) => (
                <li key={item.id}>
                  <MaskedHeading as="h2">{english ? item.titleEn : item.title}</MaskedHeading>
                  <p>{english ? item.textEn : item.text}</p>
                </li>
              ))}
            </ul>
            <div>
              {values.map((item) => (
                <p key={item.id}>
                  <strong>{english ? valueCopy[item.id].en : item.title}</strong>
                  {english ? valueCopy[item.id].text : item.text}
                </p>
              ))}
              <p className="fine">{english ? methodology.en : methodology.ar}</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="wrap narrow-copy">
            <p>{t('audiencePage.match')}</p>
            <p>{t('audiencePage.catalog')}</p>
            <p>{t('audiencePage.disclaimer')}</p>
          </div>
        </section>
      )}
    </PageMotion>
  )
}
