import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function PointerFollower() {
  const node = useRef(null)

  useEffect(() => {
    const dot = node.current
    if (!dot) return undefined
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return undefined
    dot.hidden = false
    gsap.set(dot, { xPercent: -50, yPercent: -50 })
    const x = gsap.quickTo(dot, 'x', { duration: 0.45, ease: 'power3.out' })
    const y = gsap.quickTo(dot, 'y', { duration: 0.45, ease: 'power3.out' })
    const onMove = (event) => {
      x(event.clientX)
      y(event.clientY)
      const field = event.target.closest('input, textarea, select')
      const interactive = event.target.closest('a, button, [data-cursor]')
      dot.classList.toggle('is-hot', Boolean(interactive) && !field)
      dot.classList.toggle('is-quiet', Boolean(field))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return <div ref={node} className="pointer-follower" hidden aria-hidden="true" />
}
