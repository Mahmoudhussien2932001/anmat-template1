import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-scrubbed page turn between the direct section children.
 * Desktop folds the leaving page around its bottom edge and unfolds the next
 * around its top edge. Mobile uses a short scrubbed reveal. Reduced motion
 * keeps normal document flow. No pinning, and this context stays outside the
 * page-entrance hook so a language change does not remove the turn.
 */
export default function BookTurn({ children }) {
  const root = useRef(null)

  useEffect(() => {
    const node = root.current
    if (!node) return undefined
    const ctx = gsap.context(() => {
      const pages = [...node.querySelectorAll(':scope > [data-book-page]')]
      if (pages.length < 2) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const [leaving, entering] = pages
      const narrow = window.matchMedia('(max-width: 959px)').matches
      if (narrow) {
        gsap.fromTo(entering, { y: 18, opacity: 0.9 }, {
          y: 0,
          opacity: 1,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: entering,
            start: 'top 98%',
            end: 'top 68%',
            scrub: true,
          },
        })
        return
      }

      const range = {
        trigger: leaving,
        start: 'bottom 88%',
        end: 'bottom 20%',
        scrub: true,
      }
      gsap.fromTo(leaving, { rotateX: 0 }, {
        rotateX: -11,
        ease: 'none',
        transformOrigin: 'center bottom',
        immediateRender: false,
        scrollTrigger: range,
      })
      gsap.fromTo(entering, { rotateX: 7 }, {
        rotateX: 0,
        ease: 'none',
        transformOrigin: 'center top',
        immediateRender: false,
        scrollTrigger: { ...range },
      })
    }, node)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="book-turn">
      {children}
    </div>
  )
}
