import { useState } from 'react'
import { Link, NavLink, useLocation, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function SiteHeader() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const nextLang = lang === 'en' ? 'ar' : 'en'
  const nextPath = `${location.pathname.replace(/^\/(ar|en)/, `/${nextLang}`)}${location.search}${location.hash}`

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to={`/${lang}`} onClick={() => setOpen(false)}>
          <span className="brand-chip">
            <img src="/images/logo.png" alt={t('brand')} width="132" height="36" />
          </span>
        </Link>

        <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((value) => !value)}>
          {open ? t('nav.close') : t('nav.menu')}
        </button>

        <nav id="site-nav" className={open ? 'site-nav is-open' : 'site-nav'}>
          <NavLink to={`/${lang}`} end onClick={() => setOpen(false)}>{t('nav.home')}</NavLink>
          <a href={`/${lang}#services`} onClick={() => setOpen(false)}>{t('nav.features')}</a>
          <NavLink to={`/${lang}/franchisor`} onClick={() => setOpen(false)}>{t('nav.franchisor')}</NavLink>
          <NavLink to={`/${lang}/investor`} onClick={() => setOpen(false)}>{t('nav.investor')}</NavLink>
          <NavLink to={`/${lang}/opportunities`} onClick={() => setOpen(false)}>{t('nav.opportunities')}</NavLink>
          <a href={`/${lang}/knowledge#about`} onClick={() => setOpen(false)}>{t('nav.about')}</a>
          <NavLink to={`/${lang}/knowledge`} onClick={() => setOpen(false)}>{t('nav.knowledge')}</NavLink>
          <NavLink to={`/${lang}/contact`} onClick={() => setOpen(false)}>{t('nav.contact')}</NavLink>
          <Link className="lang-switch" to={nextPath} onClick={() => setOpen(false)}>{nextLang === 'en' ? 'EN' : 'عربي'}</Link>
        </nav>

        <div className="header-actions">
          <NavLink className="header-cta" to={`/${lang}/contact`} onClick={() => setOpen(false)}>
            {t('nav.demo')} →
          </NavLink>
        </div>
      </div>
    </header>
  )
}
