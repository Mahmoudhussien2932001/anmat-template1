import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { MaskEpoch } from '../../motion/usePageEntrance.js'

function sameLines(left, right) {
  if (!left || !right || left.length !== right.length) return false
  return left.every((line, index) => line === right[index])
}

function measureLines(node, text) {
  const clean = text.replace(/\s+/g, ' ').trim()
  const words = clean.split(' ').filter(Boolean)
  if (words.length < 2) return [clean]
  const width = node.getBoundingClientRect().width
  if (!width) return [clean]
  const probe = document.createElement(node.tagName)
  probe.className = node.className
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:auto;margin:0;'
  probe.style.width = `${width}px`
  const wordNodes = []
  words.forEach((word, index) => {
    if (index) probe.append(' ')
    const span = document.createElement('span')
    span.textContent = word
    probe.append(span)
    wordNodes.push(span)
  })
  node.parentElement?.append(probe)
  const lines = []
  let bucket = []
  let top = null
  wordNodes.forEach((span) => {
    const nextTop = span.offsetTop
    if (top === null || Math.abs(nextTop - top) <= 3) {
      bucket.push(span.textContent)
      top = nextTop
    } else {
      lines.push(bucket.join(' '))
      bucket = [span.textContent]
      top = nextTop
    }
  })
  if (bucket.length) lines.push(bucket.join(' '))
  probe.remove()
  return lines.length ? lines : [clean]
}

export default function MaskedHeading({ as: Tag = 'h2', className, style, children }) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const ref = useRef(null)
  const bump = useContext(MaskEpoch)
  const [lines, setLines] = useState(null)
  const [storedText, setStoredText] = useState(text)
  if (text !== storedText) {
    setStoredText(text)
    setLines(null)
  }

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const apply = () => {
      const next = measureLines(node, text)
      if (next.length < 2) return
      let changed = false
      setLines((current) => {
        if (sameLines(current, next)) return current
        changed = true
        return next
      })
      if (changed) bump()
    }
    apply()
    let cancel = false
    document.fonts?.ready.then(() => {
      if (!cancel) apply()
    })
    return () => {
      cancel = true
    }
  }, [bump, text])

  const shown = lines ?? [text]
  return (
    <Tag ref={ref} className={className} style={style}>
      {shown.map((line, index) => (
        <span className="mask-line" key={index}>
          <span className="mask-line-inner">{line}</span>
        </span>
      ))}
    </Tag>
  )
}
