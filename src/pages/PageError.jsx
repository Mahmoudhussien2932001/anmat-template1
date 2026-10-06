import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

export default function PageError() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const safe = lang === 'en' ? 'en' : 'ar'
  return (
    <section className="page-hero">
      <div className="wrap">
        <h1>{t('error.title')}</h1>
        <Link className="button" to={`/${safe}`}>{t('error.back')}</Link>
      </div>
    </section>
  )
}
