import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useSectionMotion(scopeRef) {
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const items = gsap.utils.toArray('.reveal')
    items.forEach((item) => {
      gsap.from(item, {
        autoAlpha: 0,
        y: 18,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })
    })
    return undefined
  }, { scope: scopeRef })
}
