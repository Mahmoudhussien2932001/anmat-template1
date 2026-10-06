import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { MagneticLink } from '../motion/MagneticLink.jsx'

export default function LandmarkStage() {
  const root = useRef(null)
  const { t } = useTranslation()
  const { lang } = useParams()

  useGSAP(() => {
    const photo = root.current?.querySelector('.landmark-photo')
    const refresh = () => ScrollTrigger.refresh()
    if (photo && !photo.complete) photo.addEventListener('load', refresh, { once: true })
    document.fonts?.ready.then(refresh)

    const mm = gsap.matchMedia()
    mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
      const first = root.current.querySelector('[data-chapter="one"]')
      const second = root.current.querySelector('[data-chapter="two"]')
      gsap.set(second, { autoAlpha: 0 })
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=90%',
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      timeline.fromTo('.landmark-photo', { y: 24, scale: 0.98 }, { y: -16, scale: 1.03, ease: 'none', duration: 1 }, 0)
      timeline.to(first, { autoAlpha: 0, y: -16, ease: 'none', duration: 0.22 }, 0.4)
      timeline.fromTo(second, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, ease: 'none', duration: 0.24 }, 0.55)
      return () => {
        gsap.set([first, second, '.landmark-photo'], { clearProps: 'all' })
      }
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section className="landmark-story" id="landmark" data-header-theme="dark" ref={root}>
      <div className="landmark-chapters">
        <article className="landmark-chapter" data-chapter="one" data-header-theme="dark">
          <h2>{t('landmark.one')}</h2>
          <p>{t('landmark.oneText')}</p>
        </article>
        <img
          className="landmark-photo"
          src="/images/landmarks/riyadh-kingdom-centre.png"
          alt=""
          width="1024"
          height="1536"
        />
        <article className="landmark-chapter is-end" data-chapter="two" data-header-theme="dark">
          <h2>{t('landmark.two')}</h2>
          <p>{t('landmark.twoText')}</p>
          <MagneticLink className="button button-gold" to={`/${lang}/contact`}>{t('landmark.action')}</MagneticLink>
        </article>
      </div>
    </section>
  )
}
