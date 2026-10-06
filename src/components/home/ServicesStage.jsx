import { useState } from 'react'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

const ids = ['programs', 'studies', 'expansion', 'training', 'awareness', 'institutions']

export default function ServicesStage() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const [active, setActive] = useState(ids[0])
  const index = ids.indexOf(active)

  return (
    <section className="stage services-stage" id="services" data-header-theme="dark">
      <div className="wrap">
        <header className="stage-heading">
          <p className="eyebrow">{t('services.eyebrow')}</p>
          <h2>{t('services.title')}</h2>
        </header>
        <div className="services-layout">
        <div className="service-list" role="listbox" aria-activedescendant={`service-${active}`}>
          {ids.map((id, itemIndex) => (
            <button
              key={id}
              id={`service-${id}`}
              type="button"
              role="option"
              aria-selected={active === id}
              className={active === id ? 'service-row is-active' : 'service-row'}
              onMouseEnter={() => setActive(id)}
              onFocus={() => setActive(id)}
              onClick={() => setActive(id)}
            >
              <span>0{itemIndex + 1}</span>
              <strong>{t(`services.${id}`)}</strong>
            </button>
          ))}
        </div>
        <article className="service-panel" aria-live="polite">
          <p className="panel-index">0{index + 1}</p>
          <h3>{t(`services.${active}`)}</h3>
          <p>{t(`services.${active}Text`)}</p>
          <a className="text-link" href={`/${lang}/franchisor`}>{t('services.more')}</a>
        </article>
        </div>
      </div>
    </section>
  )
}
