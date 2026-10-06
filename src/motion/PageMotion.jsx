import { useCallback, useRef, useState } from 'react'
import { MaskEpoch, usePageEntrance } from './usePageEntrance.js'

export default function PageMotion({ watch = [], className, scopeRef, children }) {
  const localRef = useRef(null)
  const [epoch, setEpoch] = useState(0)
  const bump = useCallback(() => setEpoch((value) => value + 1), [])
  const setRoot = useCallback((node) => {
    localRef.current = node
    if (scopeRef) scopeRef.current = node
  }, [scopeRef])
  usePageEntrance(localRef, [...watch, epoch])
  return (
    <MaskEpoch.Provider value={bump}>
      <div ref={setRoot} className={className}>{children}</div>
    </MaskEpoch.Provider>
  )
}
