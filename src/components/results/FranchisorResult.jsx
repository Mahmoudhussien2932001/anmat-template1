import { useTranslation } from 'react-i18next'

export default function FranchisorResult({ result }) {
  const { t } = useTranslation()
  return (
    <div className="result-copy">
      <p className="step-count">{t('assessment.result')}</p>
      <h2 id="assessment-heading" tabIndex={-1}>{result.hasGaps ? t('assessment.foundation') : t('assessment.review')}</h2>
      <p>{t('assessment.initial')}</p>
      {result.hasGaps ? (
        <>
          <h3>{t('assessment.gaps')}</h3>
          <ul className="gap-list">
            {result.gaps.map((item) => (
              <li key={item.id}>
                <strong>{t(`gap.${item.id}`)}</strong>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>{t('assessment.clear')}</p>
      )}
      <p className="service-line">{t('assessment.suggested')}: {t(`service.${result.suggestedService.id}`)}</p>
    </div>
  )
}
