import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const motion = {
  ease: {
    out: 'power3.out',
    inOut: 'power3.inOut',
    none: 'none',
  },
  duration: {
    fast: 0.35,
    base: 0.8,
    slow: 1.35,
  },
  stagger: 0.08,
  heroPin: '+=130%',
  journeyPin: '+=170%',
  landmarkPin: '+=190%',
}

export const riyadh = { lat: 24.81, lon: 46.74 }
