import { RULES_VERSION, answerLabel, isComplete } from '../data/assessment.js'

const AUDIENCE_LABELS = {
  franchisor: 'مانح امتياز',
  investor: 'مستثمر',
}

export function buildHandoff({ audience, questions, answers, franchisorResult, match }) {
  if (!isComplete(questions, answers)) return null
  if (audience === 'franchisor' && !franchisorResult) return null
  if (audience === 'investor' && !match) return null

  const readableAnswers = questions.map((question) => ({
    questionId: question.id,
    answerId: answers[question.id],
    question: question.prompt,
    answer: answerLabel(questions, question.id, answers[question.id]),
  }))

  const summary = readableAnswers.map((item) => `${item.question}: ${item.answer}`).join('\n')

  return {
    rulesVersion: RULES_VERSION,
    audience,
    audienceLabel: AUDIENCE_LABELS[audience],
    answers: readableAnswers,
    summary,
    gaps: audience === 'franchisor' ? franchisorResult.gaps.map((item) => ({ id: item.id, label: item.label })) : [],
    priorityId: audience === 'franchisor' ? answers.priority : null,
    suggestedService: audience === 'franchisor' ? franchisorResult.suggestedService : null,
    opportunityIds: audience === 'investor' ? match.matches.map((item) => item.id) : [],
    filters: audience === 'investor' ? match.filters : null,
    createdAt: new Date().toISOString(),
  }
}

export function defaultContactMessage(handoff) {
  if (!handoff) return 'أرغب في مناقشة الخطوة التالية مع الفريق.'
  if (handoff.audience === 'investor') return 'أرغب في مناقشة تفضيلاتي والفرص المرتبطة بها.'
  return 'أرغب في مناقشة احتياج علامتي وفق التقييم الأولي.'
}
