import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useBlocker, useLocation, useNavigationType, useParams } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import SiteHeader from './components/layout/SiteHeader.jsx'
import SiteFooter from './components/layout/SiteFooter.jsx'
import PointerFollower from './components/motion/PointerFollower.jsx'
import AssessmentDialog from './components/assessment/AssessmentDialog.jsx'
import { useSession } from './state/useSession.js'
import i18n from './i18n.js'
import { scrollToTop, setupSmoothScroll, startSmoothScroll, stopSmoothScroll } from './motion/smoothScroll.js'

export default function App() {
  const { lang } = useParams()
  const location = useLocation()
  const navigationType = useNavigationType()
  const { t } = useTranslation()
  const { setAudience } = useSession()
  const [dialogAudience, setDialogAudience] = useState(null)
  const [seenPath, setSeenPath] = useState(location.pathname)
  const triggerRef = useRef(null)
  const coverRef = useRef(null)
  const reducedRef = useRef(false)

  if (seenPath !== location.pathname) {
    setSeenPath(location.pathname)
    setDialogAudience(null)
  }

  useEffect(() => {
    const safe = lang === 'en' ? 'en' : 'ar'
    if (i18n.language !== safe) i18n.changeLanguage(safe)
    document.documentElement.lang = safe
    document.documentElement.dir = safe === 'ar' ? 'rtl' : 'ltr'
    document.title = safe === 'en' ? 'FranchiseME' : 'فرنشايزمي | FranchiseME'
  }, [lang])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      reducedRef.current = media.matches
    }
    sync()
    media.addEventListener('change', sync)
    setupSmoothScroll()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => media.removeEventListener('change', sync)
  }, [])

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (reducedRef.current) return false
    return currentLocation.pathname !== nextLocation.pathname
  })

  useEffect(() => {
    if (blocker.state !== 'blocked' || !coverRef.current) return undefined
    const tween = gsap.to(coverRef.current, {
      scaleY: 1,
      duration: 0.42,
      ease: 'power3.inOut',
      overwrite: true,
      onComplete: () => {
        if (blocker.state === 'blocked') blocker.proceed()
      },
    })
    return () => tween.kill()
  }, [blocker])

  useEffect(() => {
    if (blocker.state === 'blocked' || !coverRef.current) return undefined
    if (navigationType !== 'POP') scrollToTop(true)
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    }
    const tween = gsap.to(coverRef.current, {
      scaleY: 0,
      duration: reducedRef.current ? 0 : 0.5,
      delay: 0.05,
      ease: 'power3.inOut',
      overwrite: true,
    })
    return () => tween.kill()
  }, [location.pathname, location.hash, blocker.state, navigationType])

  useEffect(() => {
    if (dialogAudience) stopSmoothScroll()
    else startSmoothScroll()
  }, [dialogAudience])

  function openAssessment(audience, event) {
    setAudience(audience)
    triggerRef.current = event?.currentTarget ?? null
    setDialogAudience(audience)
  }

  if (lang !== 'ar' && lang !== 'en') return <Navigate to="/ar" replace />

  return (
    <div className="site">
      <a className="skip-link" href="#content">{t('skip')}</a>
      <SiteHeader />
      <main id="content">
        <Outlet context={{ openAssessment }} />
      </main>
      <SiteFooter />
      <PointerFollower />
      <div className="route-wipe" ref={coverRef} aria-hidden="true" />
      {dialogAudience ? (
        <AssessmentDialog audience={dialogAudience} triggerRef={triggerRef} onClose={() => setDialogAudience(null)} />
      ) : null}
    </div>
  )
}
