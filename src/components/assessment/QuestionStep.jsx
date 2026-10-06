import { useTranslation } from 'react-i18next'

export default function QuestionStep({ question, index, total, selectedId, onSelect }) {
  const { t } = useTranslation()

  function label(answer) {
    const key = `q.${question.id}.${answer.id}`
    const translated = t(key)
    return translated === key ? answer.label : translated
  }

  function onKeyDown(event) {
    const nextKey = event.key === 'ArrowDown' || event.key === 'ArrowLeft'
    const prevKey = event.key === 'ArrowUp' || event.key === 'ArrowRight'
    if (!nextKey && !prevKey) return
    event.preventDefault()
    const current = question.answers.findIndex((item) => item.id === selectedId)
    const delta = nextKey ? 1 : -1
    const start = current < 0 ? 0 : current
    const next = (start + delta + question.answers.length) % question.answers.length
    onSelect(question.answers[next].id)
    const radios = event.currentTarget.querySelectorAll('[role="radio"]')
    radios[next]?.focus()
  }

  return (
    <div>
      <p className="step-count">{t('assessment.question')} {index + 1} {t('assessment.of')} {total}</p>
      <h2 id="assessment-heading" tabIndex={-1}>{t(`q.${question.id}.prompt`)}</h2>
      <p className="fine">{t('assessment.private')}</p>
      {question.note ? <p className="fine">{t('assessment.countryNote')}</p> : null}
      <div className="answer-list" role="radiogroup" aria-labelledby="assessment-heading" onKeyDown={onKeyDown}>
        {question.answers.map((answer) => {
          const selected = selectedId === answer.id
          return (
            <button
              key={answer.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={selected ? 'answer-card is-selected' : 'answer-card'}
              onClick={() => onSelect(answer.id)}
            >
              <span>{label(answer)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
