import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'
import { processSteps } from '../../data/company.js'
import { motion } from '../../motion/settings.js'

export default function JourneyStage() {
  const root = useRef(null)
  const stepRef = useRef(0)
  const [step, setStep] = useState(0)
  const { t } = useTranslation()

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: `top ${document.querySelector('.site-header')?.offsetHeight || 76}px`,
          end: motion.journeyPin,
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(processSteps.length - 1, Math.floor(self.progress * processSteps.length))
            if (next !== stepRef.current) {
              stepRef.current = next
              setStep(next)
            }
          },
        },
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section className="journey-stage" data-header-theme="dark" ref={root} id="journey">
      <div className="wrap journey-layout">
        <div className="journey-visual" aria-hidden="true">
          <span>{processSteps[step].index}</span>
          <small>{t(`journey.${processSteps[step].id}`)}</small>
        </div>
        <div>
          <p className="eyebrow">{t('journey.eyebrow')}</p>
          <h2>{t('journey.title')}</h2>
          <ol className="journey-list">
            {processSteps.map((item, index) => (
              <li key={item.id} className={index === step ? 'is-active' : ''} aria-current={index === step ? 'step' : undefined}>
                <span>{item.index}</span>
                <div>
                  <h3>{t(`journey.${item.id}`)}</h3>
                  <p>{t(`journey.${item.id}Text`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
