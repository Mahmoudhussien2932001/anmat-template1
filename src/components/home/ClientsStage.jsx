import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'
import { engagements, documentedFigures } from '../../data/company.js'

const english = {
  'oman-chamber': 'Oman Chamber of Commerce and Industry',
  monshaat: 'Monsha’at — Tomoh Franchise',
  bahrain: 'Bahrain Chamber and Tamkeen',
  mcdonalds: 'McDonald’s Saudi Arabia',
  shawarmer: 'Shawarmer',
  jazeera: 'Jazeera Paints',
  lemaschou: 'Le Machou — France',
  yamaha: 'Yamaha — Saudi Arabia',
  waynes: 'Wayne’s Coffee — Sweden',
  takamol: 'Takamol — Salamah',
  alhokair: 'Fawaz Alhokair',
}

export default function ClientsStage() {
  const root = useRef(null)
  const { t, i18n } = useTranslation()

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined
    const tween = gsap.from('.client-name', {
      clipPath: 'inset(0 0 100% 0)',
      stagger: 0.06,
      ease: 'power3.out',
      duration: 0.7,
      scrollTrigger: { trigger: root.current, start: 'top 75%' },
    })
    return () => tween.kill()
  }, { scope: root })

  function shift(event) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const row = event.currentTarget
    const box = row.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    row.style.transform = `translate3d(${x * 14}px, 0, 0)`
  }

  return (
    <section className="clients-stage" id="clients" data-header-theme="dark" ref={root}>
      <div className="wrap">
        <p className="eyebrow">{t('clients.eyebrow')}</p>
        <h2>{t('clients.title')}</h2>
        <ul className="figure-list">
          {documentedFigures.map((item) => (
            <li key={item.id}>
              <strong>{item.figure}</strong>
              <span>{i18n.language === 'en' ? item.en : item.ar}</span>
            </li>
          ))}
        </ul>
        <ul className="client-list">
          {engagements.map((item) => (
            <li key={item.id}>
              <p className="client-name" data-cursor="panel" onPointerMove={shift} onPointerLeave={(event) => { event.currentTarget.style.transform = '' }}>
                {i18n.language === 'en' ? english[item.id] : item.name}
              </p>
              {i18n.language === 'ar' ? <p>{item.detail}</p> : null}
            </li>
          ))}
        </ul>
        <p className="fine">{t('clients.note')}</p>
        <p className="fine">{t('clients.cfe')}</p>
      </div>
    </section>
  )
}
