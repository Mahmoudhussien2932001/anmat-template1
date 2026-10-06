import { useTranslation } from 'react-i18next'

export default function InvestorResult({ match }) {
  const { t } = useTranslation()
  const count = match.matches.length
  return (
    <div className="result-copy">
      <p className="step-count">{t('assessment.filter')}</p>
      {count > 0 ? (
        <>
          <h2 id="assessment-heading" tabIndex={-1}>{count} {count === 1 ? t('assessment.matchOne') : t('assessment.matchMany')}</h2>
          <p>{t('assessment.matchNote')}</p>
          <ul className="match-list">
            {match.matches.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong>
                <span>{[item.sectorLabel, item.countryLabel, item.levelLabel].filter(Boolean).join(' · ')}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2 id="assessment-heading" tabIndex={-1}>{t('assessment.noMatch')}</h2>
          <p>{t('assessment.noMatchText')}</p>
        </>
      )}
    </div>
  )
}
