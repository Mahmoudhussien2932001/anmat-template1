import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { investorQuestions } from '../data/assessment.js'
import { inquiryValue, opportunities } from '../data/opportunities.js'
import { opportunityMedia } from '../data/opportunityMedia.js'
import { matchOpportunities } from '../lib/investorMatch.js'
import PageMotion from '../motion/PageMotion.jsx'
import MaskedHeading from '../components/motion/MaskedHeading.jsx'

function questionById(id) {
  return investorQuestions.find((item) => item.id === id)
}

function validAnswer(questionId, value, fallback) {
  const question = questionById(questionId)
  return question.answers.some((item) => item.id === value) ? value : fallback
}

export default function OpportunitiesPage() {
  const { t, i18n } = useTranslation()
  const english = i18n.language === 'en'
  const { lang } = useParams()
  const [picked, setPicked] = useState([])
  const [query, setQuery] = useState('')
  const [params, setParams] = useSearchParams()
  const viewAll = params.get('view') === 'all'
  const sector = viewAll ? 'all' : validAnswer('sector', params.get('sector'), 'all')
  const level = viewAll ? 'undecided' : validAnswer('level', params.get('level'), 'undecided')
  const country = viewAll ? 'all' : validAnswer('country', params.get('country'), 'all')
  const result = useMemo(
    () => matchOpportunities(opportunities, { sector, level, country }, investorQuestions),
    [sector, level, country],
  )
  const restricted = sector !== 'all' || level !== 'undecided' || country !== 'all'
  const matches = (result?.matches ?? []).filter((item) => {
    const haystack = `${item.name} ${item.nameEn} ${item.summary} ${item.summaryEn} ${item.countryLabel} ${item.countryLabelEn} ${item.sectorLabel} ${item.sectorLabelEn}`.toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })
  const compared = picked.map((id) => opportunities.find((item) => item.id === id)).filter(Boolean)

  function toggleCompare(id) {
    setPicked((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= 2) return current
      return [...current, id]
    })
  }

  function updateFilter(key, value) {
    const next = new URLSearchParams(params)
    next.delete('view')
    next.set('sector', key === 'sector' ? value : sector)
    next.set('level', key === 'level' ? value : level)
    next.set('country', key === 'country' ? value : country)
    setParams(next)
  }

  return (
    <PageMotion className="inner-page" watch={[english]}>
      <section className="page-hero">
        <div className="wrap">
          <p className="fine">{t('opportunities.eyebrow')}</p>
          <MaskedHeading as="h1">{t('opportunities.title')}</MaskedHeading>
          <p className="lede">{t('opportunities.text')}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          {viewAll ? <p className="preview-banner">{t('opportunities.all')}</p> : null}
          <form className="filters" onSubmit={(event) => event.preventDefault()}>
            <FilterSelect id="sector" label={t('opportunities.sector')} value={sector} question={questionById('sector')} onChange={(value) => updateFilter('sector', value)} />
            <FilterSelect id="level" label={t('opportunities.level')} value={level} question={questionById('level')} onChange={(value) => updateFilter('level', value)} />
            <FilterSelect id="country" label={t('opportunities.country')} value={country} question={questionById('country')} onChange={(value) => updateFilter('country', value)} />
            <button type="button" className="button button-ghost" onClick={() => setParams({ view: 'all' })}>
              {t('opportunities.explore')}
            </button>
            <div className="field field-search">
              <label htmlFor="opportunity-search">{english ? 'Search by brand' : 'ابحث عن علامة'}</label>
              <input id="opportunity-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
          </form>
          <p className="fine">{english ? opportunities[0].caveat.en : opportunities[0].caveat.ar}</p>
          <p role="status">{matches.length} {t('opportunities.count')}</p>
          {compared.length === 2 ? <CompareTable items={compared} english={english} lang={lang} /> : null}
          {matches.length === 0 ? (
            <div className="empty-state">
              {restricted || query ? <p>{t('opportunities.emptyFilter')}</p> : null}
              <Link className="button" to={`/${lang}/contact`}>{t('opportunities.discuss')}</Link>
            </div>
          ) : (
            <div className="op-list offer-grid">
              {matches.map((item) => (
                <OpportunityCard
                  key={item.id}
                  item={item}
                  english={english}
                  lang={lang}
                  picked={picked.includes(item.id)}
                  disabled={!picked.includes(item.id) && picked.length >= 2}
                  onToggle={() => toggleCompare(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageMotion>
  )
}

function showValue(value, english) {
  return value || (english ? inquiryValue.en : inquiryValue.ar)
}

function OpportunityCard({ item, english, lang, picked, disabled, onToggle }) {
  const art = opportunityMedia[item.id]
  const country = english ? item.countryLabelEn : item.countryLabel
  return (
    <article className={picked ? 'offer-card is-picked' : 'offer-card'}>
      {art ? (
        <div className="offer-photo">
          <img src={art.photo} alt={english ? item.nameEn : item.name} />
          <span>{english ? item.sectorLabelEn : item.sectorLabel}</span>
        </div>
      ) : null}
      <div className="offer-body">
        <div className="offer-brand">
          {art ? <img className={art.tone === 'light' ? 'is-light' : ''} src={art.logo} alt="" /> : null}
          <div>
            <h3>{english ? item.nameEn : item.name}</h3>
            <small>{country} · {item.nameEn}</small>
          </div>
        </div>
        <p className="offer-summary">{english ? item.summaryEn : item.summary}</p>
        <ul className="metric-facts">
          <li><span>{english ? 'Investment level' : 'مستوى الاستثمار'}</span><strong>{english ? item.levelLabelEn : item.levelLabel}</strong></li>
          <li><span>{english ? 'Investment cost' : 'تكلفة الاستثمار'}</span><strong>{showValue(item.cost, english)}</strong></li>
          <li><span>{english ? 'Franchise fee' : 'رسوم الامتياز'}</span><strong>{showValue(item.fee, english)}</strong></li>
          <li><span>{english ? 'Annual fee' : 'الرسوم السنوية'}</span><strong>{showValue(item.royalty, english)}</strong></li>
          <li><span>{english ? 'Marketing fee' : 'رسوم التسويق'}</span><strong>{showValue(item.marketing, english)}</strong></li>
        </ul>
        {item.extra?.length ? (
          <details>
            <summary>{english ? 'More published figures' : 'أرقام إضافية كما وردت'}</summary>
            <ul className="metric-facts">
              {item.extra.map((fact) => (
                <li key={fact.en}><span>{english ? fact.en : fact.ar}</span><strong>{fact.value}</strong></li>
              ))}
            </ul>
          </details>
        ) : null}
        <div className="offer-actions">
          <label>
            <input type="checkbox" checked={picked} disabled={disabled} onChange={onToggle} />
            {english ? 'Compare' : 'قارن'}
          </label>
        </div>
        <Link className="button offer-interest" to={`/${lang}/contact`}>{english ? 'I am interested in this opportunity' : 'أنا مهتم بهذه الفرصة'}</Link>
      </div>
    </article>
  )
}

function CompareTable({ items, english, lang }) {
  const rows = [
    [english ? 'Sector' : 'القطاع', (item) => (english ? item.sectorLabelEn : item.sectorLabel)],
    [english ? 'Brand country' : 'بلد العلامة', (item) => (english ? item.countryLabelEn : item.countryLabel)],
    [english ? 'Investment level' : 'مستوى الاستثمار', (item) => (english ? item.levelLabelEn : item.levelLabel)],
    [english ? 'Investment cost' : 'تكلفة الاستثمار', (item) => showValue(item.cost, english)],
    [english ? 'Franchise fee' : 'رسوم الامتياز', (item) => showValue(item.fee, english)],
    [english ? 'Annual fee' : 'الرسوم السنوية', (item) => showValue(item.royalty, english)],
    [english ? 'Marketing fee' : 'رسوم التسويق', (item) => showValue(item.marketing, english)],
  ]
  return (
    <div className="compare-table">
      <MaskedHeading as="h2">{english ? 'Compare two opportunities' : 'مقارنة فرصتين'}</MaskedHeading>
      <table>
        <thead>
          <tr>
            <th>{english ? 'Item' : 'المعيار'}</th>
            {items.map((item) => <th key={item.id}>{english ? item.nameEn : item.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, read]) => (
            <tr key={label}>
              <td>{label}</td>
              {items.map((item) => <td key={item.id}>{read(item)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="fine">{english ? items[0].caveat.en : items[0].caveat.ar}</p>
      <Link className="button" to={`/${lang}/contact`}>{english ? 'Discuss these options' : 'ناقش الخيارات مع الفريق'}</Link>
    </div>
  )
}

function FilterSelect({ id, label, value, question, onChange }) {
  const { t } = useTranslation()
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const [open, setOpen] = useState(false)
  const options = question.answers.map((answer) => {
    const key = `q.${question.id}.${answer.id}`
    const translated = t(key)
    return { id: answer.id, label: translated === key ? answer.label : translated }
  })
  const current = options.find((option) => option.id === value) ?? options[0]

  useEffect(() => {
    if (!open) return undefined
    listRef.current?.focus()
    function onPointer(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  function choose(next, close = false) {
    onChange(next)
    if (close) setOpen(false)
  }

  function onListKey(event) {
    const index = Math.max(0, options.findIndex((option) => option.id === value))
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      choose(options[(index + 1) % options.length].id)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      choose(options[(index - 1 + options.length) % options.length].id)
    } else if (event.key === 'Home') {
      event.preventDefault()
      choose(options[0].id)
    } else if (event.key === 'End') {
      event.preventDefault()
      choose(options[options.length - 1].id)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div className={open ? 'field menu-field is-open' : 'field menu-field'} ref={rootRef}>
      <span id={`${id}-label`}>{label}</span>
      <button
        type="button"
        id={id}
        className="menu-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}`}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        <span>{current?.label}</span>
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
          <path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <ul
        id={`${id}-list`}
        className="menu-list"
        role="listbox"
        aria-labelledby={`${id}-label`}
        hidden={!open}
        tabIndex={-1}
        ref={listRef}
        onKeyDown={onListKey}
      >
        {options.map((option) => {
          const selected = option.id === value
          return (
            <li key={option.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={selected ? 'is-selected' : ''}
                onClick={() => choose(option.id, true)}
              >
                <span>{option.label}</span>
                {selected ? <span className="menu-mark" aria-hidden="true" /> : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
