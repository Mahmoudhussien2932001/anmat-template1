import { useRef } from 'react'
import { Link, useOutletContext, useParams } from 'react-router'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useTranslation } from 'react-i18next'
import { visibleMarkers } from '../../data/markers.js'
import { globeMotion, faceLongitude, holdGlobe } from '../../motion/globeMotion.js'
import { motion } from '../../motion/settings.js'
import { useSession } from '../../state/useSession.js'
import { MagneticButton } from '../motion/MagneticLink.jsx'

export default function HeroStage() {
  const root = useRef(null)
  const { t, i18n } = useTranslation()
  const { openAssessment, accent, setAccent } = useOutletContext()
  const { audience, setAudience } = useSession()
  const { lang } = useParams()
  const mode = audience === 'investor' ? 'investor' : 'franchisor'
  const language = i18n.language === 'en' ? 'en' : 'ar'

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 900px)').matches
    if (reduced) {
      globeMotion.intro = 1
      return undefined
    }
    const intro = gsap.timeline()
    intro.to(globeMotion, { intro: 1, duration: motion.duration.slow, ease: motion.ease.out }, 0)
    intro.from('.line-inner', { yPercent: 110, duration: motion.duration.base, stagger: motion.stagger, ease: motion.ease.out }, 0.12)

    if (!desktop) return () => intro.kill()

    const scrub = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: motion.heroPin,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          globeMotion.scroll = self.progress
        },
      },
    })
    scrub.to('.hero-foreground', { autoAlpha: 0, y: -36, ease: 'none' }, 0.15)
    return () => {
      intro.kill()
      globeMotion.scroll = 0
    }
  }, { scope: root })

  function choose(next) {
    setAudience(next)
    const lon = next === 'investor' ? 50.58 : 46.74
    gsap.to(globeMotion, {
      audience: next === 'investor' ? 1 : 0,
      yaw: faceLongitude(lon),
      duration: motion.duration.base,
      ease: motion.ease.inOut,
      overwrite: 'auto',
    })
  }

  function focusMarker(marker) {
    setAccent(marker.id)
    holdGlobe(true)
    gsap.to(globeMotion, {
      yaw: faceLongitude(marker.lon),
      duration: motion.duration.base,
      ease: motion.ease.inOut,
      overwrite: 'auto',
    })
  }

  return (
    <section className="hero-stage" data-header-theme="dark" ref={root}>
      <div className="hero-foreground">
        <div className="audience-switch" role="tablist" aria-label={t('switch.label')}>
          {['franchisor', 'investor'].map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={mode === item}
              className={mode === item ? 'is-selected' : ''}
              onClick={() => choose(item)}
            >
              {t(`switch.${item}`)}
            </button>
          ))}
        </div>
        <div className="hero-stack">
        {['franchisor', 'investor'].map((item) => (
          <div key={item} className={mode === item ? 'hero-copy is-active' : 'hero-copy'} aria-hidden={mode !== item}>
            <p className="eyebrow line"><span className="line-inner">{t(`hero.${item}Eyebrow`)}</span></p>
            <h1>
              <span className="line"><span className="line-inner">{t(`hero.${item}Lead`)}</span></span>
              <span className="line emphasis"><span className="line-inner">{t(`hero.${item}Emphasis`)}</span></span>
            </h1>
            <p className="support line"><span className="line-inner">{t(`hero.${item}Support`)}</span></p>
            <div className="hero-actions">
              <MagneticButton className="button button-gold" onClick={(event) => openAssessment(item, event)}>
                {t(`hero.${item}Action`)}
              </MagneticButton>
              {item === 'investor' ? (
                <Link className="text-link" to={`/${lang}/opportunities`}>{t('hero.allLink')}</Link>
              ) : (
                <a className="text-link" href="#services">{t('hero.servicesLink')}</a>
              )}
              <Link className="text-link" to={`/${lang}/contact`} onClick={() => setAudience(item)}>
                {t(item === 'investor' ? 'hero.investorForm' : 'hero.franchisorForm')}
              </Link>
            </div>
          </div>
        ))}
        </div>
        <p className="fine hero-note">{t('hero.optional')}</p>
        <ul className="location-list">
          {visibleMarkers.map((marker) => (
            <li key={marker.id}>
              <button
                type="button"
                className={accent === marker.id ? 'is-selected' : ''}
                onClick={() => focusMarker(marker)}
                onFocus={() => focusMarker(marker)}
                onBlur={() => {
                  holdGlobe(false)
                }}
              >
                <span>{marker.kind === 'office' ? t('globe.office') : t('globe.project')}</span>
                {marker.label[language]}
              </button>
            </li>
          ))}
        </ul>
        <p className="fine location-note">{t('globe.estimated')}</p>
        <p className="scroll-cue">{t('hero.scroll')}</p>
      </div>
    </section>
  )
}
