import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { company } from '../../data/company.js'

export default function SiteFooter() {
  const { t, i18n } = useTranslation()
  const { lang } = useParams()
  const english = i18n.language === 'en'

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div className="footer-brand">
            <p className="brand">
              <strong>FranchiseME</strong>
              <span className="brand-mark" aria-hidden="true" />
            </p>
            <h2>{t('footer.transform')}</h2>
            <p>{t('footer.text')}</p>
          </div>
          <nav className="footer-nav" aria-label={t('footer.pages')}>
            <h2>{t('footer.pages')}</h2>
            <div className="footer-links">
              <Link to={`/${lang}`}>{t('nav.home')}</Link>
              <Link to={`/${lang}/franchisor`}>{t('nav.franchisor')}</Link>
              <a href={`/${lang}#services`}>{t('nav.features')}</a>
              <Link to={`/${lang}/investor`}>{t('nav.investor')}</Link>
              <Link to={`/${lang}/opportunities`}>{t('nav.opportunities')}</Link>
              <a href={`/${lang}/knowledge#about`}>{t('nav.about')}</a>
              <Link to={`/${lang}/knowledge`}>{t('nav.knowledge')}</Link>
              <Link to={`/${lang}/contact`}>{t('nav.contact')}</Link>
            </div>
          </nav>
        </div>
        <div className="footer-contact">
          <a href={company.phoneHref}>
            <small>{t('contact.call')}</small>
            <b dir="ltr">{company.phone}</b>
          </a>
          <a href={`mailto:${company.email}`}>
            <small>{t('contact.email')}</small>
            {company.email}
          </a>
          <p>
            <small>{t('globe.address')}</small>
            {english ? company.addressEn : company.address}
          </p>
          <div className="footer-social">
            <h2>{t('footer.social')}</h2>
            <a href="https://www.linkedin.com/company/franchiseme/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://www.instagram.com/franchiseme_ksa/" target="_blank" rel="noopener">Instagram</a>
            <a href="https://x.com/FranchiseME24" target="_blank" rel="noopener">X</a>
          </div>
        </div>
        <p className="footer-note">
          <span>{t('footer.noteTitle')}</span>
          {t('footer.note')}
        </p>
      </div>
    </footer>
  )
}
