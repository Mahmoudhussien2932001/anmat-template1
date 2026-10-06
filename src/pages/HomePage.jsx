import { useRef, useState } from 'react'
import { useOutletContext, useParams } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'
import HeroGlobeStage from '../components/home/HeroGlobeStage.jsx'
import InvestorOffers from '../components/home/InvestorOffers.jsx'
import { MagneticButton, MagneticLink } from '../components/motion/MagneticLink.jsx'
import MaskedHeading from '../components/motion/MaskedHeading.jsx'
import { company } from '../data/company.js'
import { clientLogos, investorPhases, ownerPhases } from '../data/sourceContent.js'
import {
  pathCopy,
  sharedLabels,
} from '../data/homeContent.js'
import BookTurn from '../motion/BookTurn.jsx'
import PageMotion from '../motion/PageMotion.jsx'
import { useSession } from '../state/useSession.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function pick(copy, english) {
  return english ? copy.en : copy.ar
}

export default function HomePage() {
  const root = useRef(null)
  const { i18n } = useTranslation()
  const { lang } = useParams()
  const { openAssessment } = useOutletContext()
  const { audience, setAudience } = useSession()
  const english = i18n.language === 'en'
  const mode = audience === 'investor' ? 'investor' : 'franchisor'
  const path = pathCopy[mode]
  const phases = mode === 'investor' ? investorPhases : ownerPhases
  const [phase, setPhase] = useState(0)
  const activePhase = phases[Math.min(phase, phases.length - 1)]

  const seenPhase = useRef(phase)
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const narrow = window.matchMedia('(max-width: 959px)').matches
    if (reduced || narrow) return undefined
    const glow = root.current?.querySelector('.journey-glow')
    if (!glow) return undefined
    const drift = gsap.to(glow, {
      y: -42,
      ease: 'none',
      scrollTrigger: {
        trigger: '#services',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    return () => drift.kill()
  }, { scope: root })

  useGSAP(() => {
    if (seenPhase.current === phase) return undefined
    seenPhase.current = phase
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const panel = root.current?.querySelector('.journey-panel')
    if (!panel) return undefined
    const narrow = window.matchMedia('(max-width: 959px)').matches
    const story = panel.querySelector('.journey-story')
    const build = panel.querySelector('.journey-build')
    const heads = panel.querySelectorAll('.mask-line-inner')
    const lines = panel.querySelectorAll('.check-list li')
    const tween = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } })
    tween.from([story, build].filter(Boolean), {
      y: narrow ? 12 : 22,
      opacity: 0,
      duration: narrow ? 0.45 : 0.7,
      stagger: 0.1,
      clearProps: 'transform,opacity',
    })
    tween.from(heads.length ? heads : panel.querySelectorAll('h3'), {
      y: 16,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      clearProps: 'transform,opacity',
    }, 0.08)
    tween.from(lines, {
      y: 12,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      clearProps: 'transform,opacity',
    }, 0.16)
    return () => tween.kill()
  }, { scope: root, dependencies: [phase] })

  return (
    <PageMotion scopeRef={root} watch={[english, mode]}>
      <BookTurn>
      <section className="hero-saas" id="top" data-book-page>
        <div className="wrap hero-layout">
          <div className="hero-copy">
            <div className="hero-paths" role="tablist" aria-label={english ? 'Choose your path' : 'اختر مسارك'}>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'franchisor'}
                className={mode === 'franchisor' ? 'is-selected' : ''}
                onClick={() => setAudience('franchisor')}
              >
                {english ? 'I am a franchisor' : 'أنا مانح امتياز'}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'investor'}
                className={mode === 'investor' ? 'is-selected' : ''}
                onClick={() => setAudience('investor')}
              >
                {english ? 'I am an investor' : 'أنا مستثمر'}
              </button>
            </div>
            <MaskedHeading as="h1">{pick(path.title, english)}</MaskedHeading>
            <p className="support">{pick(path.text, english)}</p>
            <div className="hero-actions">
              <a className="button-ghost" href="#services">{pick(pathCopy.franchisor.primary, english)} →</a>
              {mode === 'investor' ? (
                <MagneticLink className="button-ghost" to={`/${lang}/opportunities`}>{pick(pathCopy.investor.primary, english)} →</MagneticLink>
              ) : null}
              <MagneticButton className="button button-gold" onClick={(event) => openAssessment(mode, event)}>
                {pick(path.secondary, english)} →
              </MagneticButton>
            </div>
          </div>
          <HeroGlobeStage mode={mode} />
        </div>
      </section>

      <section className="logo-strip" data-book-page aria-label={english ? 'Brands we are proud to serve' : 'علامات نفخر بخدمتها'}>
        <div className="wrap client-bar">
          <p className="client-label">{english ? 'Brands we are proud to serve' : 'علامات نفخر بخدمتها'}</p>
          <span className="client-rule" aria-hidden="true" />
          <div className="logo-row">
            {clientLogos.map((logo) => (
              <span key={logo.en}>
                <img src={logo.src} alt={english ? logo.en : logo.ar} />
              </span>
            ))}
          </div>
        </div>
      </section>
      </BookTurn>

      {mode === 'investor' ? <InvestorOffers english={english} lang={lang} /> : null}

      {mode === 'franchisor' ? (
      <section className="section" id="services">
        <div className="wrap journey-stage-wrap">
          <div className="journey-glow" aria-hidden="true" />
          <MaskedHeading as="h2" className="journey-title">
            {mode === 'franchisor'
              ? (english ? 'From your brand… to a first franchise.' : 'من علامتك... إلى أول امتياز.')
              : pick(path.sectionTitle, english)}
          </MaskedHeading>
          <div className="journey-track" role="tablist" aria-label={english ? 'Stages' : 'المراحل'}>
            <span className="journey-line" aria-hidden="true" />
            {phases.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className={index === Math.min(phase, phases.length - 1) ? 'journey-step is-selected' : 'journey-step'}
                aria-selected={index === Math.min(phase, phases.length - 1)}
                onClick={() => setPhase(index)}
              >
                <span className="journey-index">0{index + 1}</span>
                <span className="journey-name">{pick(item.title, english)}</span>
              </button>
            ))}
          </div>
          <div className="journey-board journey-panel" key={activePhase.id}>
            <article className="journey-story">
              <MaskedHeading as="h3">{pick(activePhase.lead, english)}</MaskedHeading>
              <p>{pick(activePhase.text, english)}</p>
              <button
                type="button"
                className="journey-next"
                onClick={() => setPhase((index) => (index + 1) % phases.length)}
              >
                {english ? 'Next stage' : 'المرحلة التالية'}
                <span aria-hidden="true">{english ? '→' : '←'}</span>
              </button>
            </article>
            <aside className="journey-build">
              <p className="fine">{english ? 'What do we build in this stage?' : 'ماذا نبني في هذه المرحلة؟'}</p>
              <MaskedHeading as="h3">{pick(activePhase.deliverable, english)}</MaskedHeading>
              <ul className="check-list">
                {activePhase.items[english ? 'en' : 'ar'].map((item) => (
                  <li key={item} className="journey-item"><span className="check" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
      ) : null}

      {mode === 'investor' ? (
      <section className="section">
          <div className="wrap split path-stage">
              <div>
                <MaskedHeading as="h2">{pick(sharedLabels.studiesTitle, english)}</MaskedHeading>
                <p className="fine" style={{ marginTop: 14 }}>{pick(path.sectionText, english)}</p>
                <ul className="check-list">
                  {investorPhases.slice(2).map((item) => (
                    <li key={item.id}><span className="check" aria-hidden="true" />{pick(item.title, english)}</li>
                  ))}
                </ul>
                <MagneticLink className="button" style={{ marginTop: 22 }} to={`/${lang}/contact`}>{pick(path.final, english)}</MagneticLink>
              </div>
              <div className="glass-card">
                <p className="fine">{pick(investorPhases[3].lead, english)}</p>
                <MaskedHeading as="h3">{pick(investorPhases[3].title, english)}</MaskedHeading>
                <p style={{ marginTop: 10 }}>{pick(investorPhases[3].text, english)}</p>
                <p className="fine" style={{ marginTop: 18 }}>{pick(investorPhases[3].deliverable, english)}</p>
                <ul className="check-list">
                  {investorPhases[3].items[english ? 'en' : 'ar'].map((item) => (
                    <li key={item}><span className="check" aria-hidden="true" />{item}</li>
                  ))}
                </ul>
              </div>
          </div>
      </section>
      ) : null}

      <section className="section" id="contact">
        <div className="wrap cta-band path-stage">
          <div>
            <MaskedHeading as="h2">{pick(path.final, english)}</MaskedHeading>
            <p className="fine" style={{ marginTop: 12 }}>{pick(sharedLabels.contactTitle, english)}</p>
            <MagneticLink className="button" style={{ marginTop: 18 }} to={`/${lang}/contact`}>{pick(path.final, english)}</MagneticLink>
          </div>
          <div className="dashboard-preview is-compact">
            <div className="dashboard-bar">
              <strong>FranchiseME</strong>
              <span>{english ? 'Riyadh' : 'الرياض'}</span>
            </div>
            <div className="contact-panel">
              <a href={company.phoneHref} dir="ltr">{company.phone}</a>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <p>{english ? company.addressEn : company.address}</p>
            </div>
          </div>
        </div>
      </section>
    </PageMotion>
  )
}

