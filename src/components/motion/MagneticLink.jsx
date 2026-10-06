import { useRef } from 'react'
import { Link } from 'react-router'
import { useMagnetic } from './useMagnetic.js'

export function MagneticButton({ className = '', children, ...props }) {
  const ref = useRef(null)
  useMagnetic(ref)
  return (
    <button ref={ref} className={className} data-cursor="action" {...props}>
      {children}
    </button>
  )
}

export function MagneticLink({ className = '', children, ...props }) {
  const ref = useRef(null)
  useMagnetic(ref)
  return (
    <Link ref={ref} className={className} data-cursor="action" {...props}>
      {children}
    </Link>
  )
}
