import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useMatch } from 'react-router'
import { globeMotion } from '../../motion/globeMotion.js'
import GlobeFallback from './GlobeFallback.jsx'

const HeroGlobe = lazy(() => import('./HeroGlobe.jsx'))

export default function GlobeLayer({ accent, onAccent }) {
  const home = Boolean(useMatch('/:lang'))
  const layer = useRef(null)
  const [scrollLive, setScrollLive] = useState(true)
  const setAccent = useCallback((id) => {
    onAccent((current) => (current === id ? current : id))
  }, [onAccent])

  useEffect(() => {
    const node = layer.current
    if (!node) return undefined
    if (!home) {
      globeMotion.active = false
      document.documentElement.style.setProperty('--globe-fade', '0')
      document.documentElement.classList.add('globe-quiet')
      return undefined
    }
    const sync = () => {
      const hidden = document.visibilityState !== 'visible'
      const span = window.innerHeight * (window.innerWidth < 960 ? 0.85 : 1.25)
      const progress = Math.min(1, Math.max(0, window.scrollY / span))
      document.documentElement.style.setProperty('--globe-fade', hidden ? '0' : String(1 - progress))
      document.documentElement.classList.toggle('globe-quiet', progress > 0.2 || hidden)
      const next = !hidden && progress < 0.98
      globeMotion.active = next
      setScrollLive((current) => (current === next ? current : next))
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [home])

  return (
    <div className={home ? 'globe-layer is-live' : 'globe-layer'} ref={layer}>
      <Suspense fallback={<GlobeFallback />}>
        <HeroGlobe accent={accent} onAccent={setAccent} live={home && scrollLive} />
      </Suspense>
    </div>
  )
}
