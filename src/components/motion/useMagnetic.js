import { useEffect } from 'react'
import gsap from 'gsap'

export function useMagnetic(ref) {
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return undefined
    const x = gsap.quickTo(node, 'x', { duration: 0.4, ease: 'power3.out' })
    const y = gsap.quickTo(node, 'y', { duration: 0.4, ease: 'power3.out' })
    const onMove = (event) => {
      const box = node.getBoundingClientRect()
      x((event.clientX - (box.left + box.width / 2)) * 0.28)
      y((event.clientY - (box.top + box.height / 2)) * 0.28)
    }
    const reset = () => {
      x(0)
      y(0)
    }
    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', reset)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', reset)
    }
  }, [ref])
}
