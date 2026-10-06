import { Component, lazy, Suspense } from 'react'
import GlobeFallback from './GlobeFallback.jsx'
import { locationNote, places } from '../../data/locations.js'

const HeroGlobe = lazy(() => import('./HeroGlobe.jsx'))

class GlobeBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return <GlobeFallback />
    return this.props.children
  }
}

export default function HeroVisual() {
  const offices = places.filter((place) => place.kind === 'office')
  const projects = places.filter((place) => place.kind === 'project')

  return (
    <div className="hero-visual">
      <GlobeBoundary>
        <Suspense fallback={<GlobeFallback />}>
          <HeroGlobe />
        </Suspense>
      </GlobeBoundary>
      <div className="place-legend">
        <p><strong>مكتب</strong></p>
        <ul>
          {offices.map((place) => <li key={place.id}>{place.name} — {place.detail}</li>)}
        </ul>
        <p><strong>خبرات سابقة</strong></p>
        <ul>
          {projects.map((place) => <li key={place.id}>{place.name}</li>)}
        </ul>
        <p className="fine">{locationNote}</p>
      </div>
    </div>
  )
}
