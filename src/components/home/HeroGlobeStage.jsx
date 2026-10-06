import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe3D } from '../ui/3d-globe.jsx'
import { buildGlobeMarkers } from '../../data/globeBranches.js'
import { buildInvestorMarkets } from '../../data/investorMarkets.js'

const branchFocus = { lat: 24.812, lng: 46.741 }
const marketFocus = { lat: 24.714, lng: 46.675 }

export default function HeroGlobeStage({ mode = 'franchisor' }) {
  const { t, i18n } = useTranslation()
  const english = i18n.language === 'en'
  const [motion, setMotion] = useState(() => ({
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    coarse: window.matchMedia('(hover: none), (pointer: coarse)').matches,
    narrow: window.matchMedia('(max-width: 600px)').matches,
  }))

  useEffect(() => {
    const reducedMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarseMedia = window.matchMedia('(hover: none), (pointer: coarse)')
    const narrowMedia = window.matchMedia('(max-width: 600px)')
    const sync = () => {
      setMotion({ reduced: reducedMedia.matches, coarse: coarseMedia.matches, narrow: narrowMedia.matches })
    }
    sync()
    reducedMedia.addEventListener('change', sync)
    coarseMedia.addEventListener('change', sync)
    narrowMedia.addEventListener('change', sync)
    return () => {
      reducedMedia.removeEventListener('change', sync)
      coarseMedia.removeEventListener('change', sync)
      narrowMedia.removeEventListener('change', sync)
    }
  }, [])

  const [hovered, setHovered] = useState(null)
  const [pinnedId, setPinnedId] = useState(null)

  const investor = mode === 'investor'
  const markers = useMemo(() => {
    if (investor) return buildInvestorMarkets(english, motion.narrow)
    return buildGlobeMarkers(english).map((marker) => ({
      ...marker,
      kicker: marker.kind === 'office' ? t('globe.office') : t('globe.project'),
      addressLabel: t('globe.address'),
      phoneLabel: t('globe.phone'),
      emailLabel: t('globe.email'),
      closeLabel: t('globe.closeCard'),
    }))
  }, [english, investor, motion.narrow, t])

  const config = useMemo(() => ({
    showAtmosphere: true,
    atmosphereColor: '#7A744F',
    atmosphereIntensity: 0.62,
    atmosphereBlur: 2.4,
    bumpScale: 4,
    autoRotateSpeed: motion.reduced ? 0 : 0.28,
    enableRotate: !motion.coarse,
    enableZoom: false,
    enablePan: false,
    focus: investor ? marketFocus : branchFocus,
    pulse: !motion.reduced,
    ambientIntensity: 0.62,
    pointLightIntensity: 1.25,
  }), [investor, motion.coarse, motion.reduced])

  const pinned = markers.find((marker) => marker.id === pinnedId) || null
  const active = pinned || (hovered && markers.some((marker) => marker.id === hovered.id) ? hovered : null)

  return (
    <div className="hero-globe">
      <Globe3D
        key={investor ? 'investor' : 'franchisor'}
        markers={markers}
        config={config}
        pinnedId={pinned ? pinned.id : null}
        loadingLabel={english ? 'The map is loading' : 'الخريطة تُحمَّل'}
        onMarkerHover={setHovered}
        onMarkerClick={(marker) => setPinnedId(marker?.id ?? null)}
      />
      {active ? (
        <article className="globe-card" aria-live="polite">
          <p className="globe-kicker">{active.kicker}</p>
          <strong>{active.label}</strong>
          <p>{active.location}</p>
          {active.address ? <p><span>{active.addressLabel}</span>{active.address}</p> : null}
          {active.phoneHref ? (
            <p><span>{active.phoneLabel}</span><a href={active.phoneHref} dir="ltr">{active.phone}</a></p>
          ) : null}
          {active.email ? (
            <p><span>{active.emailLabel}</span><a href={`mailto:${active.email}`}>{active.email}</a></p>
          ) : null}
          {active.note ? <p className="globe-note">{active.note}</p> : null}
          <button
            type="button"
            className="globe-card-close"
            onClick={() => {
              setPinnedId(null)
              setHovered(null)
            }}
          >
            {active.closeLabel}
          </button>
        </article>
      ) : null}
      {investor ? null : <p className="fine globe-estimate">{t('globe.estimated')}</p>}
    </div>
  )
}
