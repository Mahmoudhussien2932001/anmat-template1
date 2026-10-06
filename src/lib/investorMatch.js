import { isComplete, isUnrestricted } from '../data/assessment.js'

function passes(question, answerId, recordValue) {
  if (isUnrestricted(question, answerId)) return true
  if (!recordValue) return false
  return recordValue === answerId
}

export function matchOpportunities(records, answers, questions) {
  if (!isComplete(questions, answers)) return null

  const sector = questions.find((item) => item.id === 'sector')
  const level = questions.find((item) => item.id === 'level')
  const country = questions.find((item) => item.id === 'country')

  const matches = records.filter((record) =>
    passes(sector, answers.sector, record.sectorId)
    && passes(level, answers.level, record.levelId)
    && passes(country, answers.country, record.countryId),
  )

  return {
    matches,
    broadened: false,
    filters: {
      sector: answers.sector,
      level: answers.level,
      country: answers.country,
    },
  }
}
