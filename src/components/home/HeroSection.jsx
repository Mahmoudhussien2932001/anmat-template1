import { Link } from 'react-router'
import AudienceSwitch from './AudienceSwitch.jsx'
import HeroVisual from '../globe/HeroVisual.jsx'
import { heroContent } from '../../data/hero.js'
import { useSession } from '../../state/useSession.js'

export default function HeroSection({ onOpen }) {
  const { audience, setAudience } = useSession()
  const copy = heroContent[audience]

  return (
    <section className="hero">
      <div className="wrap">
        <AudienceSwitch audience={audience} onChange={setAudience} />
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>
              {copy.lead}
              <br />
              <em>{copy.emphasis}</em>
            </h1>
            <p className="lede">{copy.support}</p>
            <div className="hero-actions">
              <button type="button" className="button button-gold" onClick={(event) => onOpen(audience, event)}>
                {copy.action}
              </button>
              {audience === 'franchisor' ? (
                <Link className="text-link" to="/franchisor">استكشف الخدمات</Link>
              ) : (
                <Link className="text-link" to="/opportunities">جميع الفرص</Link>
              )}
            </div>
          </div>
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
