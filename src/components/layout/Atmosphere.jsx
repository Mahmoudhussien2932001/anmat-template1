import { useEffect, useRef } from 'react'

const points = [
  { x: '12%', y: '22%', d: 14 },
  { x: '78%', y: '18%', d: 22 },
  { x: '64%', y: '46%', d: 8 },
  { x: '28%', y: '62%', d: 11 },
  { x: '86%', y: '72%', d: 16 },
  { x: '42%', y: '84%', d: 7 },
  { x: '18%', y: '40%', d: 9 },
]

export default function Atmosphere() {
  const root = useRef(null)

  useEffect(() => {
    const node = root.current
    if (!node) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(min-width: 800px)')
    let frame = 0
    let visible = document.visibilityState === 'visible'

    const apply = (time) => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0
      node.style.setProperty('--p', progress.toFixed(4))
      if (reduced.matches || !visible || !fine.matches) return
      node.querySelectorAll('[data-drift]').forEach((item, index) => {
        const sway = Math.sin(time / 5200 + index * 1.4) * 16
        const lift = Math.cos(time / 6800 + index) * 12
        item.style.transform = `translate3d(${sway}px, ${lift}px, 0)`
      })
    }

    const loop = (time) => {
      frame = 0
      if (!visible || reduced.matches) return
      apply(time)
      frame = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
      if (visible && !reduced.matches && !frame) frame = requestAnimationFrame(loop)
      if (!visible) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    const onScroll = () => apply(performance.now())
    apply(0)
    if (!reduced.matches) frame = requestAnimationFrame(loop)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="atmosphere" ref={root} aria-hidden="true">
      <div className="atmosphere-wash" />
      <svg className="atmosphere-mark" viewBox="0 0 200 200">
        <path d="M40 120 L100 28 L160 120 L128 120 L100 74 L72 120 Z" />
        <path d="M58 146 H142" />
      </svg>
      <svg className="atmosphere-path" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <path d="M-20 280 C 180 140, 360 360, 620 210 S 980 40, 1220 180" />
      </svg>
      {points.map((point) => (
        <span key={point.x + point.y} className="atmosphere-point" data-drift="" style={{ insetInlineStart: point.x, top: point.y, width: point.d, height: point.d }} />
      ))}
    </div>
  )
}
