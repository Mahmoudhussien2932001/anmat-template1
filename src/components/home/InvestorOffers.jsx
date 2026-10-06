import { useRef, useState } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import MaskedHeading from '../motion/MaskedHeading.jsx'
import { opportunities } from '../../data/opportunities.js'
import { opportunityMedia } from '../../data/opportunityMedia.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const featuredIds = ['dukkan-waffle', 'mezaj-magribi', 'simsim']

export default function InvestorOffers({ english, lang }) {
  const root = useRef(null)
  const [picked, setPicked] = useState([])
  const featured = featuredIds.map((id) => opportunities.find((item) => item.id === id)).filter(Boolean)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined
    const narrow = window.matchMedia('(max-width: 959px)').matches
    const cards = gsap.utils.toArray('.offer-card')
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: '.offer-grid', start: 'top 84%', once: true },
    })
    timeline.from(cards, {
      y: narrow ? 18 : 42,
      opacity: 0,
      duration: narrow ? 0.5 : 0.8,
      stagger: narrow ? 0.08 : 0.14,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    })
    timeline.from('.offer-photo img', {
      scale: narrow ? 1.04 : 1.12,
      duration: narrow ? 0.6 : 0.95,
      stagger: narrow ? 0.08 : 0.14,
      ease: 'power2.out',
      clearProps: 'transform',
    }, 0)
    timeline.from('.offer-brand, .offer-summary, .offer-meta, .offer-actions', {
      y: narrow ? 8 : 16,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    }, 0.18)
    return () => timeline.kill()
  }, { scope: root })

  function toggle(id) {
    setPicked((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= 2) return current
      return [...current, id]
    })
  }

  const compared = picked.map((id) => opportunities.find((item) => item.id === id)).filter(Boolean)

  return (
    <section className="section" id="opportunities-preview">
      <div className="wrap" ref={root}>
        <header className="offer-head">
          <MaskedHeading as="h2">{english ? 'Choose from the available opportunities.' : 'اختر من الفرص المتاحة.'}</MaskedHeading>
          <Link className="offer-all" to={`/${lang}/opportunities`}>
            {english ? 'View all' : 'عرض الجميع'}
            <span aria-hidden="true">{english ? '→' : '←'}</span>
          </Link>
        </header>
        <div className="offer-grid">
          {featured.map((item) => {
            const art = opportunityMedia[item.id]
            const selected = picked.includes(item.id)
            return (
              <article key={item.id} className={selected ? 'offer-card is-picked' : 'offer-card'}>
                <div className="offer-photo">
                  <img src={art.photo} alt={english ? item.nameEn : item.name} />
                  <span>{english ? item.sectorLabelEn : item.sectorLabel}</span>
                </div>
                <div className="offer-body">
                  <div className="offer-brand">
                    <img className={art.tone === 'light' ? 'is-light' : ''} src={art.logo} alt="" />
                    <div>
                      <h3>{english ? item.nameEn : item.name}</h3>
                      <small>{english ? item.countryLabelEn : item.countryLabel} · {item.nameEn}</small>
                    </div>
                  </div>
                  <p className="offer-summary">{english ? item.summaryEn : item.summary}</p>
                  <div className="offer-meta">
                    <span>{english ? 'Investment level' : 'مستوى الاستثمار'}</span>
                    <b>{english ? item.levelLabelEn : item.levelLabel}</b>
                  </div>
                  <div className="offer-actions">
                    <Link to={`/${lang}/opportunities`}>
                      {english ? 'Opportunity details' : 'تفاصيل الفرصة'}
                      <span aria-hidden="true">{english ? '→' : '←'}</span>
                    </Link>
                    <label>
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={!selected && picked.length >= 2}
                        onChange={() => toggle(item.id)}
                      />
                      {english ? 'Compare' : 'قارن'}
                    </label>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {compared.length === 2 ? (
          <div className="offer-compare">
            <p>{compared.map((item) => (english ? item.nameEn : item.name)).join(' + ')}</p>
            <Link className="button" to={`/${lang}/opportunities`}>{english ? 'Compare on the opportunities page' : 'قارن في صفحة الفرص'}</Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
