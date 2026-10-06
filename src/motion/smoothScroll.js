import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis
let reduced = false
let tickerBound = false

export function setupSmoothScroll() {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || lenis) return lenis
  lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  if (!tickerBound) {
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
    tickerBound = true
  }
  return lenis
}

export function scrollToTop(immediate = true) {
  if (lenis && !reduced) lenis.scrollTo(0, { immediate })
  else window.scrollTo(0, 0)
}

export function stopSmoothScroll() {
  lenis?.stop()
}

export function startSmoothScroll() {
  if (!reduced) lenis?.start()
}

export function destroySmoothScroll() {
  if (!lenis) return
  lenis.destroy()
  lenis = undefined
}
