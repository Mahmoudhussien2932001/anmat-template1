import { isComplete, questionsFor } from '../data/assessment.js'

export const AUDIENCES = ['franchisor', 'investor']
const STORAGE_KEY = 'franchiseme-session'

export function blankAssessment() {
  return { answers: {}, step: 0, phase: 'questions' }
}

export function createSession() {
  return {
    audience: 'franchisor',
    assessments: {
      franchisor: blankAssessment(),
      investor: blankAssessment(),
    },
    handoff: null,
  }
}

function cleanAnswers(questions, source) {
  const answers = {}
  if (!source || typeof source !== 'object') return answers
  for (const question of questions) {
    const answerId = source[question.id]
    if (question.answers.some((item) => item.id === answerId)) answers[question.id] = answerId
  }
  return answers
}

export function sanitizeAssessment(value, questions) {
  const answers = cleanAnswers(questions, value?.answers)
  const complete = isComplete(questions, answers)
  const phase = value?.phase === 'result' && complete ? 'result' : 'questions'
  const maxStep = Math.max(questions.length - 1, 0)
  const rawStep = Number.isInteger(value?.step) ? value.step : 0
  const step = phase === 'result' ? maxStep : Math.min(Math.max(rawStep, 0), maxStep)
  return { answers, step, phase }
}

export function hydrateSession(raw) {
  const base = createSession()
  if (!raw || typeof raw !== 'object') return base
  return {
    audience: AUDIENCES.includes(raw.audience) ? raw.audience : base.audience,
    assessments: {
      franchisor: sanitizeAssessment(raw.assessments?.franchisor, questionsFor('franchisor')),
      investor: sanitizeAssessment(raw.assessments?.investor, questionsFor('investor')),
    },
    handoff: raw.handoff && typeof raw.handoff === 'object' ? raw.handoff : null,
  }
}

function replaceAssessment(state, audience, assessment) {
  return {
    ...state,
    assessments: {
      ...state.assessments,
      [audience]: assessment,
    },
  }
}

export function reduceSession(state, action) {
  if (action.type === 'set-audience') {
    if (!AUDIENCES.includes(action.audience) || action.audience === state.audience) return state
    return { ...state, audience: action.audience }
  }

  if (action.type === 'set-handoff') {
    return { ...state, handoff: action.handoff }
  }

  if (!AUDIENCES.includes(action.audience)) return state
  const current = state.assessments[action.audience]
  const questions = questionsFor(action.audience)

  if (action.type === 'answer') {
    const question = questions.find((item) => item.id === action.questionId)
    if (!question?.answers.some((item) => item.id === action.answerId)) return state
    return replaceAssessment(state, action.audience, {
      ...current,
      answers: { ...current.answers, [action.questionId]: action.answerId },
    })
  }

  if (action.type === 'set-step') {
    const maxStep = Math.max(questions.length - 1, 0)
    const step = Math.min(Math.max(action.step, 0), maxStep)
    return replaceAssessment(state, action.audience, { ...current, step, phase: 'questions' })
  }

  if (action.type === 'show-result') {
    if (!isComplete(questions, current.answers)) return state
    return replaceAssessment(state, action.audience, { ...current, phase: 'result' })
  }

  if (action.type === 'edit') {
    return replaceAssessment(state, action.audience, {
      ...current,
      phase: 'questions',
      step: Math.max(questions.length - 1, 0),
    })
  }

  if (action.type === 'restart') {
    return replaceAssessment(state, action.audience, blankAssessment())
  }

  return state
}

export function loadSession() {
  if (typeof sessionStorage === 'undefined') return createSession()
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return hydrateSession(raw ? JSON.parse(raw) : null)
  } catch {
    return createSession()
  }
}

export function saveSession(state) {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
